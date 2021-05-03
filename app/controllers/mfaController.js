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
const CliController = require('./cliController.js');
const Domain = require('../models/domain.js');
const Config = require('../models/config.js');

class MfaController extends CliController {
  /**
   * Constructor
   * @param program
   */
  constructor(program) {
    super(program);
    if (program.domain) {
      this.domain = program.domain;
    } else {
      this.domain = new Domain();
    }
    this.provider = null;
    this.URL_MFA_VERIFY_TOTP = `${this.domain.url}/mfa/verify/totp.json?api-version=v2`;
    this.URL_MFA_VERIFY_YUBIKEY = `${this.domain.url}/mfa/verify/yubikey.json?api-version=v2`;
  }

  /**
   * Return true if mfa verification is required
   *
   * @param response
   * @returns {boolean}
   */
  isMfaRequired(response) {
    let required = false;
    if (response.statusCode === 403) {
      const body = this._parseResponse(response);
      if (body.header.url.startsWith('/mfa/verify')) {
        required = true;
        const serverProviders = this._parseResponse(response).body.providers || null;

        try {
          this.provider = this.getProvider(serverProviders).toLowerCase();
        } catch (error) {
          this.error(error.message);
        }
      }
    }
    return required;
  }

  /**
   * Mfa verify request (POST)
   *
   * @returns {Promise<void>}
   */
  async mfaVerify() {
    const otp = await this.promptMfa();
    const crsfToken = await this.getCsrfToken();
    const response = await this.post({
      url: this.getMfaVerifyUrl(),
      jar: this.cookieJar,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-CSRF-Token': crsfToken
      },
      form: this.getMfaVerifyPostData(otp)
    });

    if (response.statusCode !== 200) {
      this.log(JSON.parse(response.body), 'verbose');
      const msg = `There was a problem with MFA authentication. (HTTP Code:${response.statusCode})`;
      this.error(msg);
    }
  }

  /**
   * getMfaProvider
   *
   * @param {array} serverProviders
   * @returns {string} preferred provider
   */
  getProvider(serverProviders) {
    if (!serverProviders) {
      throw new Error('No MFA provider found. Aborting.');
    }
    const userProviders = this.getProvidersFromUserConfig();
    let provider; let serverProvider;
    for (serverProvider in serverProviders) {
      if (serverProviders.hasOwnProperty(serverProvider)) {
        if (serverProvider !== 'duo' && userProviders.includes(serverProvider)) {
          provider = serverProvider;
          break;
        }
      }
    }
    if (!provider) {
      const msg = 'No supported MFA provider found in config.' +
        ' Please setup an additional provider using passbolt web client.';
      throw new Error(msg);
    }
    return provider;
  }

  /**
   * Return providers from user config or default supported ones if not set
   *
   * @returns {array} providers name
   */
  getProvidersFromUserConfig() {
    let userProviders;
    const config = Config.get();
    if (!config.mfa || !config.mfa.providers || config.mfa.providers.length === 0) {
      userProviders = ['totp', 'yubikey'];
    } else {
      userProviders = config.mfa.providers;
      if (!Array.isArray(userProviders) || userProviders.length === 0) {
        const msg = 'No supported MFA provider found in user config. Please setup MFA provider preferences.';
        this.error(msg);
      }
      if (userProviders.length === 1 && userProviders[0].toLowerCase() === 'duo') {
        const msg ='Duo is not a supported MFA provider. Please edit MFA provider preferences to include more providers.';
        this.error(msg);
      }
      for (let i = 0; i < userProviders.length; i++) {
        userProviders[i] = userProviders[i].toLowerCase();
      }
    }
    return userProviders;
  }

  /**
   * Return verification url for mfa for selected provider
   *
   * @returns {string} url
   */
  getMfaVerifyUrl() {
    let url;
    switch (this.provider) {
      case 'yubikey':
        url = this.URL_MFA_VERIFY_YUBIKEY;
        break;
      case 'totp':
        url = this.URL_MFA_VERIFY_TOTP;
        break;
      default:
        this.error(`MFA provider not supported: ${this.provider}`);
    }
    return url;
  }

  /**
   * Get data formated for mfa verify post request
   *
   * @param {string} otp
   * @returns {*} object
   */
  getMfaVerifyPostData(otp) {
    let data;
    switch (this.provider) {
      case 'yubikey':
        data = {'hotp': otp};
        break;
      case 'totp':
        data = {'totp': otp};
        break;
      default:
        this.error(`MFA provider not supported: ${this.provider}`);
    }
    return data;
  }

  /**
   * Capture otp from user from select provider
   *
   * @returns {Promise<*>} otp
   */
  async promptMfa() {
    let otp;
    switch (this.provider) {
      case 'totp':
        otp = await this.promptTOTP();
        break;
      case 'yubikey':
        otp = await this.promptYubikeyOTP();
        break;
    }
    return otp;
  }

  /**
   * Get TOTP from user input
   *
   * @returns {Promise<string>} otp
   */
  async promptTOTP() {
    const input = await this.prompt({
      properties: {
        otp: {
          description: 'Please enter the one time password displayed on your tablet or phone.\notp',
          pattern: /^[0-9]{6}$/,
          message: 'One time password must be a six digit number.',
          required: true
        }
      }
    });
    return input.otp;
  }

  /**
   * Get Yubikey OTP from user input
   *
   * @returns {Promise<string>} otp
   */
  async promptYubikeyOTP() {
    const input = await this.prompt({
      properties: {
        otp: {
          description: 'Plug in your yubikey and put your finger on it.\notp',
          pattern: /^[cbdefghijklnrtuv]{44}$/,
          message: 'Yubikey OTP must be a ModHex compatible 44 characters in length string.',
          required: true,
          hidden: true
        }
      }
    });
    return input.otp;
  }
}

module.exports = MfaController;
