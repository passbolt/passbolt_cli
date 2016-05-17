/**
 * Controller
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";
var i18n = require('../models/i18n.js');

class Controller {

  /**
   * Controller constructor
   * @param options
   */
  constructor() {
    this._request = require('request');
  }

  /**
   * HTTP POST request
   * @param options
   * @returns {Promise}
   */
  post(options) {
    var _this = this;
    var result = undefined;
    return new Promise(function (resolve, reject) {
      try {
        _this._request
          .post(options)
          .on('response', function (response) {
            result = response;
          })
          .on('data', function(chunk) {
            result.body += chunk;
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
    var result = undefined;
    return new Promise(function (resolve, reject) {
      try {
        _this._request
          .get(options)
          .on('response', function (response) {
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
