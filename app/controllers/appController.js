/**
 * Authentication Controller
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var i18n = require('../models/i18n.js');
var GpgAuthController = require('./gpgAuthController.js');

class AppController extends GpgAuthController {
  /**
   * Constructor
   * @param program
   * @param argv
   */
  constructor (program, argv) {
    super(program, argv);
    this.URL_BASE = this.domain.url + '/' + this.getName();
  }

  /**
   * App controllers should not be instanciated without a name
   */
  getName() {
    throw new Error(i18n.__('Error: no controller name set') + options.url);
  }

  /**
   * Index Action - Find and filter
   * @returns {Promise.<T>}
   */
  index() {
    var _this = this;
    var url = _this.URL_BASE + '/index.json';

    return _this.get({
        url: url,
        jar: _this.cookieJar
      })
      .then(function(response) {
        return _this.__handleServerResponse(response);
      })
      .catch(function(err) {
        _this.error(err);
      });
  }

  /**
   * Server response handler
   * @param response
   * @returns {*}
   * @private
   */
  __handleServerResponse(response) {
    var result;
    try {
      result = JSON.parse(response.body);
    } catch (syntaxError) {
      this.log(response.body, 'verbose');
      this.error(i18n.__('Error') + ' ' + response.statusCode + i18n.__('could not parse server response.'));
    }
    return result;
  }
}

module.exports = AppController;