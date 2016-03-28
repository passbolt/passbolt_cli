/**
 * Controller
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";
var i18n = require('../models/i18n.js');

class Controller {
  constructor() {
    this._request = require('request');
  }

  log(msg) {
    console.log(msg);
  }

  error(error) {
    if(error instanceof Error) {
      this.log(error.message);
    }
    else if(typeof error === 'string') {
      this.log(error);
    }
    else {
      this.log(error);
    }
    process.exit(1);
  }

  success(msg) {
    this.log(msg);
    process.exit(0);
  }

  post(options) {
    var _this = this;
    return new Promise(function (resolve, reject) {
      try {
        _this._request
          .post(options)
          .on('response', function (response) {
            resolve(response);
          })
          .on('error', function (error) {
            var err = new Error(i18n.__('Error: could not connect to ') + options.url)
            reject(err);
          })
      } catch(err) {
        var err = new Error(i18n.__('Error: could not connect to ') + options.url)
        reject(err);
      }
    });
  }
}

module.exports = Controller;
