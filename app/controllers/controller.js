/**
 * Controller
 *
 * @copyright (c) 2017 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";
var i18n = require('../models/i18n.js');
var Config = require('../models/config.js');

class Controller {

  /**
   * Controller constructor
   * @param options
   */
  constructor(program, argv) {
    var config = Config.get();
    this._request = require('request');
    this._agentOptions = config.agentOptions;
    this._verbose = (program !== undefined && program.verbose !== undefined && program.verbose);
  }

  /**
   * Log a message in console
   * @param msg
   * @param priority
   */
  log(msg, priority) {
    if(priority === undefined || (priority === 'verbose' && this._verbose)) {
      console.log(msg);
    }
  }

  /**
   * HTTP POST request
   * @param options
   * @returns {Promise}
   */
  post(options) {
    var _this = this;
    options.agentOptions = _this._agentOptions;
    var result = undefined;
    _this.log('POST ' + options.url, 'verbose');
    return new Promise(function (resolve, reject) {
      try {
        _this._request
          .post(options)
          .on('response', function (response) {
            _this.log(response.statusCode, 'verbose');
            result = response;
          })
          .on('data', function(chunk) {
            if(result.body === undefined) {
              result.body = chunk;
            } else {
              result.body += chunk;
            }
          })
          .on('end', function() {
            resolve(result);
          })
          .on('error', function (error) {
            var err = new Error(i18n.__('Error: could not connect to ') + options.url);
            reject(err);
          })
      } catch(err) {
        var err = new Error(i18n.__('Error: could not connect to ') + options.url);
        reject(err);
      }
    });
  }

  /**
   * HTTP GET request
   * @param options
   * @returns {Promise}
   */
  get(options) {
    var _this = this;
    options.agentOptions = _this._agentOptions;
    var result = undefined;
    _this.log('GET ' + options.url, 'verbose');
    return new Promise(function (resolve, reject) {
      try {
        _this._request
          .get(options)
          .on('response', function (response) {
            _this.log(response.statusCode, 'verbose');
            result = response;
          })
          .on('data', function(chunk) {
            if(result.body === undefined) {
              result.body = chunk;
            } else {
              result.body += chunk;
            }
          })
          .on('end', function() {
            resolve(result);
          })
          .on('error', function (error) {
            var err = new Error(i18n.__('Error: could not connect to ') + options.url);
            reject(err);
          })
      } catch(err) {
        var err = new Error(i18n.__('Error: could not connect to ') + options.url);
        reject(err);
      }
    });
  }
}

module.exports = Controller;
