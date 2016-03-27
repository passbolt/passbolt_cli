/**
 * User Model
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var Model = require('./model.js');
var Key = require('./key.js');
var Config = require('./config.js');
var i18n = require('./i18n.js');

/**
 * The class that deals with users.
 */
class User extends Model {

  /**
   * Constructor
   * @throw Error if provided key fingerprint is invalid or loadDefault fails
   * @param fingerprint string
   */
  constructor(user) {
    super();
    if(user !== undefined && user.privateKey !== undefined) {
      this._key = new Key(user.privateKey);
    } else {
      var e = this.__loadDefault();
      if(e instanceof Error) {
        throw e;
      }
    }
  }

  /**
   * Validate user fields individually
   * @param field string
   * @param value string
   * @return boolean true or Error
   */
  static validate (field, value) {
    switch (field) {
      case 'username' :
        if(typeof value === 'undefined' || value === '') {
          return new Error(i18n.__('The username cannot be empty'));
        }
        if(!Model.Validator.isEmail(value)) {
          return new Error(i18n.__('The username should be a valid email address'))
        }
        break;
      case 'id' :
        if(typeof value === 'undefined' || value === '') {
          return new Error(i18n.__('The user id cannot be empty'));
        }
        if(!Model.Validator.isUUID(value)) {
          return new Error(i18n.__('The user id should be a valid UUID'))
        }
        break;
      default :
        return new Error(i18n.__('No validation defined for field: ' + field));
        break;
    }
    return true;
  }


  /**
   * Return the private key of the user
   * @returns {*}
   */
  get privateKey() {
    return this._key;
  }

  /**
   * Reset a domain as per file configuration
   * @returns {Error} or true
   * @private
   */
  __loadDefault () {
    var config = Config.get();
    if (config.user.privateKey === undefined) {
      return new Error(i18n.__("Can not read user key from file"));
    }
    this._key = new Key(config.user.privateKey);
    return true;
  };
}

module.exports = User;
