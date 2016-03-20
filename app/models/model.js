/**
 * Model base class
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var _validator = require('validator');
var i18n = require('./i18n.js');

class Model {
  static get Validator() { return _validator; }

  /**
   * Validate user fields individually
   * @param field string
   * @param value string
   * @return boolean true or Error
   */
  static validate (field, value) {
    return new Error(i18n.__('No validation defined for field: ' + field));
  }
}

module.exports = Model;
