/**
 * Authentication Controller
 *
 * @copyright (c) 2018 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
const CliController = require('./cliController.js');
const Domain = require('../models/domain.js');
const Crypto = require('../models/crypto.js');
const User = require('../models/user.js');
const GpgAuthToken = require('../models/gpgAuthToken.js');
const GpgAuthHeader = require('../models/gpgAuthHeader.js');
const i18n = require('../models/i18n.js');
const CookieStore = require('tough-cookie-file-store');
const path = require('path');

class GpgAuthController extends CliController {
  /**
   * Constructor
   */
  constructor(program) {
    super(program);
    try {
      this._parseProgramArg(program);
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
    this.appDir = path.dirname(require.main.filename);

    // URLs
    const baseUrl = `${this.domain.url}/auth/`;
    this.URL_VERIFY = `${baseUrl}verify.json`;
    this.URL_CHECKSESSION = `${baseUrl}checkSession.json`;
    this.URL_LOGIN = `${baseUrl}login.json`;
    this.URL_LOGOUT = `${baseUrl}logout`;

    // Session cookie
    this.COOKIE_FILE = `${this.appDir}/app/tmp/cookie.json`;
    this.cookie = new CookieStore(this.COOKIE_FILE);
    this.cookieJar = this._request.jar(this.cookie);
    this._request.defaults({jar: this.cookieJar});
  }

  /**
   * Is authentication required, or are we already logged in?
   * @returns {boolean}
   */
  authRequired() {

    if (this.force) {
      this._clearCookie();
      return Promise.resolve(true);
    }

    if (this.cookie.isEmpty()) {
      this.log('No authentication cookie found', 'verbose');
      return Promise.resolve(true);
    }

    if (this.cookie.isExpired()) {
      this.log('Cookie is expired', 'verbose');
      //this._clearCookie();
      return Promise.resolve(true);
    }

    return this.get({
      url: this.URL_CHECKSESSION,
      jar: this.cookieJar
    })
    .then(response => (response.statusCode !== 200))
    .catch(err => {
      this.error(err);
    });
  }

  /**
   * GPGAuth Verify Step
   */
  verify() {
    this._generateVerifyToken();

    return Crypto
    .encrypt(this.domain.publicKey.fingerprint, this.token)
    .then(encrypted => this.post({
      url: this.URL_VERIFY,
      form: {
        'data[gpg_auth][keyid]': this.user.privateKey.fingerprint,
        'data[gpg_auth][server_verify_token]': encrypted
      }
    }))
    .then(results => this._onVerifyResponse(results))
    .catch(err => {
      throw err;
    });
  }

  /**
   * Perform GPG Auth Login
   */
  loginIfNeeded() {
    return this.authRequired()
    .then(isRequired => {
      if (!isRequired) {
        this.log('GPGAuth Skipping, you are already logged in', 'verbose');
        return Promise.resolve(true);
      } else {
        this.log(`GPGAuth login start with fingerprint ${this.user.privateKey.fingerprint}`, 'verbose');
        // Stage 0 - verify the server identity
        return this.login();
      }
    });
  }

  login() {
    return this.verify()
      .then(() =>
        // Stage 1 - get a token to prove identity
        this._stage1()
      )
      .then(userAuthToken =>
        // Stage 2 - send back the decrypted token
        this._stage2(userAuthToken)
      )
      .then(response => {
        // Final stage - set the cookie and done!
        const cookie = this._request.cookie(response.headers['set-cookie'][0]);
        this.cookieJar.setCookie(cookie, this.domain.url);
        this.log('GPGAuth you are now logged in', 'verbose');
        return true;
      })
      .catch(err => {
        this.log('GPGAuth Error during login', 'verbose');
        this.error(err);
      });
  }

  /**
   * Perform GPG Auth Logout
   */
  logout() {
    return this.get({
      url: _this.URL_LOGOUT,
      jar: _this.cookieJar
    })
    .then(response => {
      this._serverResponseHealthCheck('logout', response);
      this._clearCookie();
      return true;
    })
    .catch(err => {
      this.error(err);
    });
  }

  /**
   * Check if there is an active session
   */
  check() {
    return this.get({
      url: this.URL_CHECKSESSION,
      jar: this.cookieJar
    })
    .then(response => {
      const r = JSON.parse(response.body);
      if (r.header.status === 'success') {
        console.log('You are already logged in.');
      } else {
        console.log('You are not logged in.');
      }
    });
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
    if (program !== undefined && program.fingerprint !== undefined) {
      this.user = new User({
        privateKey: {
          fingerprint: program.fingerprint
        }
      });
    } else {
      this.user = new User();
    }

    if (program !== undefined && program.domain === undefined) {
      this.domain = new Domain();
    } else {
      this.domain = program.domain;
    }

    if (program !== undefined && program.passphrase === undefined) {
      // if no passphrase is given but is needed
      // a gpg prompt will be triggered by gpg itself
    } else {
      this.passphrase = program.passphrase;
    }

    if (program !== undefined && program.force === undefined) {
      this.force = false;
    } else {
      this.force = true;
    }
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
   * @param raw response
   * @param deferred promise
   * @returns true or promise if reject
   */
  _serverResponseHealthCheck(step, response) {
    let error_msg;

    // Check if the HTTP status is OK
    if (response.statusCode !== 200) {
      return new Error(`${i18n.__('There was a problem when trying to communicate with the server')
      } (HTTP Code:${response.status})`);
    }

    // Check if there is GPGAuth error flagged by the server
    if (response.headers['x-gpgauth-error'] !== undefined) {
      error_msg = i18n.__('The server rejected the verification request.') + response.headers['x-gpgauth-debug'];
      return new Error(error_msg);
    }

    // Check if the headers are correct
    const result = GpgAuthHeader.validateByStage(step, response.headers);
    if (result === Error) {
      error_msg = i18n.__('The server was unable to respect the authentication protocol.');
      return new Error(error_msg);
    }

    return true;
  }

  /**
   * Process a verify step response
   * @param response
   * @returns {*}
   */
  _onVerifyResponse(response) {
    // check headers
    let r = this._serverResponseHealthCheck('verify', response);
    if (r instanceof Error) {
      throw new Error(r.message);
    }
    // check token
    const token = response.headers['x-gpgauth-verify-response'];
    r = GpgAuthToken.validate('token', token);
    if (r instanceof Error) {
      throw new Error(i18n.__('Error: GPGAuth verify step failed. Maybe your user does not exist or have been deleted.'));
    }
    if (this.token !== undefined && token !== this.token) {
      throw new Error(i18n.__('Error: The server was unable to identify. GPGAuth tokens do not match.'));
    }
    return response;
  }

  /**
   * GPGAuth stage 1
   * @returns {Promise.<T>}
   * @private
   */
  _stage1() {
    return this.post({
      url: this.URL_LOGIN,
      form: {
        'data[gpg_auth][keyid]': this.user.privateKey.fingerprint
      }
    })
    .then(response => {
      // perform protocol health checks on server response
      const r = this._serverResponseHealthCheck('login', response);
      if (r instanceof Error) {
        throw new Error(r.message);
      }
      // cleanup the encrypted auth string
      const compat = require('../lib/phpjs.js');
      const encryptedAuthToken = compat.stripslashes(compat.urldecode(response.headers['x-gpgauth-user-auth-token']));

      // decrypt
      let options;
      if (this.passphrase !== undefined) {
        options = ['--passphrase', this.passphrase];
      }
      return Crypto.decrypt(encryptedAuthToken, options);
    })
    .then(userAuthToken => {
      // validate decrypted token
      const r = GpgAuthToken.validate('token', userAuthToken);
      if (r instanceof Error) {
        throw new Error(r.message);
      }
      // stage 1 success
      return userAuthToken;
    })
    .catch(err => {
      this.log(err);
      throw err;
    });
  }

  /**
   * Stage 2 - Send back the decrypted token and get a cookie
   * @param userAuthToken
   * @returns {Promise.<T>}
   * @private
   */
  _stage2(userAuthToken) {
    return this.post({
      url: this.URL_LOGIN,
      form: {
        'data[gpg_auth][keyid]': this.user.privateKey.fingerprint,
        'data[gpg_auth][user_token_result]': userAuthToken
      }
    }).then(response => {
      // perform protocol health checks on server response
      const r = this._serverResponseHealthCheck('stage2', response);
      if (r instanceof Error) {
        throw new Error(r.message);
      }
      return response;
    }).catch(err => {
      this.log(err);
      throw err;
    });
  }
}

module.exports = GpgAuthController;
