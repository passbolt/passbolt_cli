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
class Domain extends Model {

  constructor(url) {
    super();
    if(url !== undefined) {
      this.url = url;
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
      case 'url':
        if(typeof value === 'undefined' || value === '') {
          return new Error(i18n.__('The url should not be be empty'));
        }
        if(!Validator.isURL(url)) {
          return new Error('This is not a valid domain url');
        }
        break;
      default:
        return new Error(i18n.__('No validation defined for field: ' + field));
        break;
    }
    return true;
  }

  /**
   * Set the domain url
   * @param url
   * @return void
   * @throw Error validation error
   */
  set url(url) {
    var result = Domain.validate('url', url);
    if(result === true) {
      this._url = url;
      return;
    }
    throw result;
  }

  /**
   * Return the domain url and optionally load it from config if there is none
   * @returns {*}
   */
  get url() {
    if (this._url == null) {
      var r = this.__loadDefault();
      if (r instanceof Error) {
        return undefined;
      }
    }
    return this._url;
  }

  /**
   * Reset a domain as per file configuration
   * @returns {Error} or true
   * @private
   */
  __loadDefault () {
    var config = Config.get();
    if (config.domain.baseUrl === undefined) {
      return new Error(i18n.__("Can not read domain url from file"));
    }
    this._url = config.domain.baseUrl;
    return true;
  };
}

module.exports = Domain;