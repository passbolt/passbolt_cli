/**
 * Authentication Controller
 *
 * @copyright (c) 2017 Passbolt SARL
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
    var url = _this.URL_BASE + '.json?api-version=v1';

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
   * View Action
   * @param id
   * @param string options
   * @returns {Promise.<T>}
   */
  view(id, options) {
    var _this = this;

    // Check if this is a valid UUID
    var validate = require('validator');
    if(!validate.isUUID(id)) {
      _this.error(i18n.__('This is not a valid UUID: ' + id));
    }

    // Get the record
    var url = _this.URL_BASE + '/' + id + '.json?api-version=v1&';
    if (typeof options !== 'undefined') {
      url += options;
    }
    console.log(url);
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