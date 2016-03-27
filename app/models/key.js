/**
 * Domain Model
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var Model = require('./model.js');
var Config = require('./config.js');
var i18n = require('./i18n.js');

/**
 * Domain model constructor
 */
class Key extends Model {

  constructor(key) {
    super();
    if(key.fingerprint !== undefined) {
      this.fingerprint = key.fingerprint;
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
      case 'fingerprint':
        break;
      default:
        return new Error(i18n.__('No validation defined for field: ' + field));
        break;
    }
    return true;
  }

  /**
   * Return the key id
   * @returns {*}
   */
  get fingerprint() {
    return this._fingerprint;
  }

  /**
   * Set a fingerprint
   * @param fingerprint
   */
  set fingerprint(fingerprint) {
    var result = Key.validate('fingerprint', fingerprint);
    if(result === true) {
      this._fingerprint = fingerprint;
      return;
    }
    throw result;
  }

}

module.exports = Key;