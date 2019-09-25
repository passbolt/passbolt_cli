/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 */
const MfaController = require('./mfaController.js');
const Compat = require('../lib/phpjs.js');
const CookieStore = require('tough-cookie-file-store');
const Crypto = require('../models/crypto.js');
const GpgAuthToken = require('../models/gpgAuthToken.js');
const GpgAuthHeader = require('../models/gpgAuthHeader.js');
const i18n = require('../models/i18n.js');
const path = require('path');
const User = require('../models/user.js');

class GpgAuthController extends MfaController {
  /**
   * Constructor
   */
  constructor(program) {
    try {
      super(program);
    } catch (error) {
      console.error(error.message);
      console.error('Make sure you created a valid configuration file in app/config/config.json.');
      console.error('See app/config/config.default.json for an example.');
      process.exit(1);
    }
    try {
      this._parseProgramArg(program);
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
    this.appDir = path.dirname(require.main.filename);

    // URLs
    const baseUrl = `${this.domain.url}/auth`;
    this.URL_VERIFY = `${baseUrl}/verify.json`;
    this.URL_CHECKSESSION = `${baseUrl}/checkSession.json`;
    this.URL_LOGIN = `${baseUrl}/login.json`;
    this.URL_LOGOUT = `${baseUrl}/logout`;

    // Session cookie
    this.COOKIE_FILE = `${this.appDir}/app/tmp/cookie.json`;
    this.cookieStore = new CookieStore(this.COOKIE_FILE);
    this.cookieJar = this._request.jar(this.cookieStore);
    this._request.defaults({jar: this.cookieJar});
  }

  /**
   * Helper to find if authentication is required
   * @returns {boolean}
   */
  async checkStatus() {
    if (this.force) {
      this.log('Clearing cookies', 'verbose');
      this._clearCookie();
      return true;
    }
    if (this.cookieStore.isEmpty()) {
      this.log('No authentication cookie found', 'verbose');
      return true;
    }
    if (this.cookieStore.isExpired()) {
      this.log('Cookie is expired', 'verbose');
      return true;
    }
    try {
      return await this.get({
        url: this.URL_CHECKSESSION,
        jar: this.cookieJar
      });
    } catch (error) {
      this.error(error);
      return true;
    }
  }

  /**
   * GPGAuth Verify Step
   */
  async verify() {
    this._generateVerifyToken();
    const encrypted = await Crypto.encrypt(this.domain.publicKey.fingerprint, this.token);
    const response = await this.post({
      url: this.URL_VERIFY,
      form: {
        'data[gpg_auth][keyid]': this.user.privateKey.fingerprint,
        'data[gpg_auth][server_verify_token]': encrypted
      }
    });
    return this._onVerifyResponse(response);
  }

  /**
   * Perform GPG Auth Login
   */
  async loginIfNeeded() {
    let response = await this.checkStatus();

    // User already logged in no mfa required
    if (response.statusCode === 200) {
      this.log('GPGAuth Skipping, you are already logged in', 'verbose');
      return true;
    }

    // User is already logged in but mfa required
    if (this.isMfaRequired(response)) {
      await this.mfaVerify();
      return true;
    }

    // User not logged in
    this.log(`GPGAuth login start with fingerprint ${this.user.privateKey.fingerprint}`, 'verbose');
    await this.login();

    // User is logged in but mfa required
    response = await this.checkStatus();
    if (this.isMfaRequired(response)) {
      await this.mfaVerify();
      return true;
    }
  }

  async getCsrfToken() {
    return new Promise((resolve, reject) => {
      const domain = this.domain.url.split("://").pop();
      const path = '/';
      const key = 'csrfToken';

      this.cookieStore.findCookie(domain, path, key, (error, cookie) => {
        if (cookie === null) {
          reject();
        } else {
          resolve(cookie.value);
        }
      });
    });
  }

  /**
   * Login action
   * @returns {Promise<boolean>}
   */
  async login() {
    try {
      await this.verify();
      const userAuthToken = await this._stage1();
      const response = await this._stage2(userAuthToken);
      const cookie = this._request.cookie(response.headers['set-cookie'][0]);
      this.cookieJar.setCookie(cookie, this.domain.url);
      this.log('GPGAuth you are now logged in', 'verbose');
      return true;
    } catch (error) {
      this.log('GPGAuth Error during login', 'verbose');
      this.error(error);
    }
  }

  /**
   * Perform GPG Auth Logout
   */
  async logout() {
    try {
      const response = await this.get({
        url: this.URL_LOGOUT,
        jar: this.cookieJar
      });
      this._serverResponseHealthCheck('logout', response);
      this._clearCookie();
      return true;
    } catch (error) {
      this.error(error);
      return false;
    }
  }

  /**
   * Check if there is an active session
   */
  async check() {
    const response = await this.get({
      url: this.URL_CHECKSESSION,
      jar: this.cookieJar
    });
    const r = JSON.parse(response.body);
    if (r.header.status === 'success') {
      console.log('You are already logged in.');
    } else {
      console.log('You are not logged in.');
    }
  }

  /* ==================================================
   *  Controller helpers
   * ==================================================
   */
  /**
   * Clear cookies if any
   */
  _clearCookie() {
    try {
      require('fs').unlinkSync(this.COOKIE_FILE);
    } catch (e) {}
  }

  /**
   * Parse program arguments
   * @param program
   * @private
   */
  _parseProgramArg(program) {
    if (!program) {
      return;
    }

    if (program.fingerprint) {
      this.user = new User({
        privateKey: {
          fingerprint: program.fingerprint
        }
      });
    } else {
      this.user = new User();
    }

    if (program.passphrase) {
      // if no passphrase is given but is needed
      // a gpg prompt will be triggered by gpg itself
      this.passphrase = program.passphrase;
    }

    this.force = program.force || false;
  }

  /**
   * Generate random verification token to be decrypted by the server
   * @returns {string}
   */
  _generateVerifyToken() {
    const t = new GpgAuthToken();
    this.token = t.token;
    return this.token;
  }

  /**
   * Check if the response from the server is looking as per the GPGAuth protocol
   * @param step
   * @param response
   * @returns boolean
   * @private
   */
  _serverResponseHealthCheck(step, response) {
    // Check if the HTTP status is OK
    if (response.statusCode !== 200) {
      throw new Error(`${i18n.__('There was a problem when trying to communicate with the server')
      } (HTTP Code:${response.status})`);
    }

    // Check if there is GPGAuth error flagged by the server
    if (response.headers['x-gpgauth-error']) {
      throw new Error(i18n.__('The server rejected the verification request.') + response.headers['x-gpgauth-debug']);
    }

    // Check if the headers are correct
    try {
      GpgAuthHeader.validateByStage(step, response.headers);
    } catch (error) {
      this.log(error.message, 'verbose');
      throw new Error(i18n.__('The server was unable to respect the authentication protocol.'));
    }

    return true;
  }

  /**
   * Process a verify step response
   * @param response
   * @returns {*}
   * @private
   */
  _onVerifyResponse(response) {
    let token;
    try {
      this._serverResponseHealthCheck('verify', response);
      token = response.headers['x-gpgauth-verify-response'];
      GpgAuthToken.validate('token', token);
    } catch (error) {
      console.log(error.message, 'verbose');
      throw new Error(i18n.__('Error: GPGAuth verify step failed. Maybe your user does not exist or have been deleted.'));
    }

    if (!this.token || token !== this.token) {
      throw new Error(i18n.__('Error: The server was unable to identify. GPGAuth tokens do not match.'));
    }
    return response;
  }

  /**
   * GPGAuth stage 1
   * @returns {Promise<any>}
   * @private
   */
  async _stage1() {
    const response = await this.post({
      url: this.URL_LOGIN,
      form: {
        'data[gpg_auth][keyid]': this.user.privateKey.fingerprint
      }
    });
    await this._serverResponseHealthCheck('stage1', response);

    // cleanup the encrypted auth string & decrypt
    const encryptedAuthToken = Compat.stripslashes(Compat.urldecode(response.headers['x-gpgauth-user-auth-token']));
    let options;
    if (this.passphrase !== undefined) {
      options = ['--passphrase', this.passphrase];
    }
    const userAuthToken = await Crypto.decrypt(encryptedAuthToken, options);
    GpgAuthToken.validate('token', userAuthToken);
    return userAuthToken;
  }

  /**
   * Stage 2 - Send back the decrypted token and get a cookie
   * @param userAuthToken
   * @returns {Promise<any>}
   * @private
   */
  async _stage2(userAuthToken) {
    const response = await this.post({
      url: this.URL_LOGIN,
      form: {
        'data[gpg_auth][keyid]': this.user.privateKey.fingerprint,
        'data[gpg_auth][user_token_result]': userAuthToken
      }
    });
    await this._serverResponseHealthCheck('complete', response);
    return response;
  }

  /**
   * Server response handler
   * @param response
   * @returns {*}
   * @private
   */
  _parseResponse(response) {
    let body;
    try {
      // set cookies if needed
      if (response.headers['set-cookie']) {
        const cookie = this._request.cookie(response.headers['set-cookie'][0]);
        this.cookieJar.setCookie(cookie, this.domain.url);
      }
      // parse json body
      body = JSON.parse(response.body);
    } catch (syntaxError) {
      this.log(response.body.toString(), 'verbose');
      this.error(`${i18n.__('Error')} ${response.statusCode} ${i18n.__('could not parse server response.')}`);
      return;
    }
    return body;
  }
}

module.exports = GpgAuthController;
