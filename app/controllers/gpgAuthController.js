/**
 * Authentication Controller
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var Domain = require('../models/domain.js');
var Crypto = require('../models/crypto.js');
var GpgAuthToken = require('../models/gpgAuthToken.js');
var GpgAuthHeader = require('../models/gpgAuthHeader.js');
var Controller = require('./controller.js');

class GpgAuthController extends Controller {

  /**
   * Constructor
   */
  constructor () {
    super();
    this.domain = new Domain();
    var baseUrl = this.domain.url + '/auth/';
    this.URL_VERIFY = baseUrl + 'verify.json';
    this.URL_LOGIN = baseUrl + 'login.json';
  }

  /**
   * Generate random verification token to be decrypted by the server
   * @returns {string}
   */
  generateVerifyToken () {
    this.verifyToken = new GpgAuthToken();
    return this.verifyToken;
  }

  /**
   * Validate Auth Token
   * @param userAuthToken
   * @returns {boolean}
   * @throw Error if validation error
   */
  validateAuthToken(authToken) {
    var result = GpgAuthToken.validate('token', authToken);
    if(result === true) {
      return true;
    } else {
      throw result;
    }
  };

  /**
   * GPGAuth Verify Step
   *
   */
  verify() {
    var _this = this;

    this.request
      .get(this.URL_VERIFY)
      .on('response', function(response) {
        var r = GpgAuthHeader.validateByStage('verify', response.headers);
        console.log(r);
      })
      .on('error', function(error) {
        console.log('Error: could not connect to ' + _this.URL_VERIFY);
      })

  }
}

module.exports = GpgAuthController;