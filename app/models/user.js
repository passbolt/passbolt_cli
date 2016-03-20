/**
 * User Model
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var Model = require('./model.js');
var i18n = require('./i18n.js');

/**
 * The class that deals with users.
 */
class User extends Model {
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

}

module.exports = User;
