/**
 * Gpg Auth Token Model
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var Model = require('./model.js');
var i18n = require('./i18n.js');
var Crypto = require('../models/crypto.js');

class GpgAuthToken extends Model {

  /**
   * Constructor
   * @param token string
   */
  constructor(token) {
    super();
    if(token === undefined) {
      this._token = 'gpgauthv1.3.0|36|';
      this._token += Crypto.uuid();
      this._token += '|gpgauthv1.3.0';
    } else {
      var result = this.validate('token', token);
      if(result === true) {
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
  static validate (field, value) {
    switch (field) {
      case 'token' :
        if(typeof value === 'undefined' || value === '') {
          return new Error(i18n.__('The user authentication token cannot be empty'));
        }
        var sections = value.split('|');
        if (sections.length !== 4) {
          return new Error(i18n.__('The user authentication token is not in the right format'));
        }
        if (sections[0] !== sections[3] && sections[0] !== 'gpgauthv1.3.0') {
          return new Error(i18n.__('Passbolt does not support this GPGAuth version'));
        }
        if (sections[1] !== '36') {
          return new Error(i18n.__('Passbolt does not support GPGAuth token nonce longer than 36 characters: ' + sections[2]));
        }
        if (!Model.Validator.isUUID(sections[2])) {
          return new Error(i18n.__('Passbolt does not support GPGAuth token nonce that are not UUIDs'));
        }
        return true;
      default :
        return new Error(i18n.__('No validation defined for field: ' + field));
    }
  }

}

module.exports = GpgAuthToken;
