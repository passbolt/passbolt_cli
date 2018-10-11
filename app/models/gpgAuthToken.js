/**
 * Gpg Auth Token Model
 *
 * @copyright (c) 2018 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
const Model = require('./model.js');
const i18n = require('./i18n.js');
const Crypto = require('../models/crypto.js');
const validator = require('validator');

class GpgAuthToken extends Model {
  /**
   * Constructor
   * @param token string
   */
  constructor(token) {
    super();
    if (token === undefined) {
      this._token = 'gpgauthv1.3.0|36|';
      this._token += Crypto.uuid();
      this._token += '|gpgauthv1.3.0';
    } else {
      const result = this.validate('token', token);
      if (result === true) {
        this._token = token;
      } else {
        throw result;
      }
    }
  }

  /**
   * Get gpg auth token text
   * @returns string token
   */
  get token() {
    return this._token;
  }

  /**
   * Validate user fields individually
   * @param field string
   * @param value string
   * @return {*} true or Error
   */
  static validate(field, value) {
    let sections;
    switch (field) {
      case 'token' :
        if (typeof value === 'undefined' || value === '') {
          return new Error(i18n.__('The user authentication token cannot be empty'));
        }
        sections = value.split('|');
        if (sections.length !== 4) {
          return new Error(i18n.__('The user authentication token is not in the right format'));
        }
        if (sections[0] !== sections[3] && sections[0] !== 'gpgauthv1.3.0') {
          return new Error(i18n.__('Passbolt does not support this GPGAuth version'));
        }
        if (sections[1] !== '36') {
          return new Error(i18n.__(`Passbolt does not support GPGAuth token nonce longer than 36 characters: ${sections[2]}`));
        }
        if (!validator.isUUID(sections[2])) {
          return new Error(i18n.__('Passbolt does not support GPGAuth token nonce that are not UUIDs'));
        }
        return true;
      default :
        return new Error(i18n.__(`No validation defined for field: ${field}`));
    }
  }
}

module.exports = GpgAuthToken;
