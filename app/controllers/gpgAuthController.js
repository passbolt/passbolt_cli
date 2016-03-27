/**
 * Authentication Controller
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var Gpg = require('gpg');
var Domain = require('../models/domain.js');
var Crypto = require('../models/crypto.js');
var User = require('../models/user.js');
var GpgAuthToken = require('../models/gpgAuthToken.js');
var GpgAuthHeader = require('../models/gpgAuthHeader.js');
var Controller = require('./controller.js');
var StringDecoder = require('string_decoder').StringDecoder;
var i18n = require('../models/i18n.js');

class GpgAuthController extends Controller {

  /**
   * Constructor
   */
  constructor (user, domain) {
    super();

    if(user === undefined) {
      this.user = new User();
    } else {
      this.user = user;
    }
    if(domain === undefined) {
      this.domain = new Domain();
    } else {
      this.domain = domain;
    }

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
    return this.verifyToken.token;
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
   * Check if the response from the server is looking as per the GPGAuth protocol
   * @param raw response
   * @param deferred promise
   * @returns true or promise if reject
   */
  serverResponseHealthCheck(step, response) {
    var error_msg;

    // Check if the HTTP status is OK
    if(response.statusCode !== 200) {
      return new Error(i18n.__('There was a problem when trying to communicate with the server') +
        ' (HTTP Code:' + response.status +')');
    }

    // Check if there is GPGAuth error flagged by the server
    if(response.headers['X-GPGAuth-Error'] != undefined) {
      error_msg = i18n.__('The server rejected the verification request.') + response.headers['X-GPGAuth-Debug'];
      return new Error(error_msg);
    }

    // Check if the headers are correct
    var result = GpgAuthHeader.validateByStage(step, response.headers);
    if(result === Error) {
      error_msg = i18n.__('The server was unable to respect the authentication protocol.');
      return new Error(error_msg);
    }

    return true;
  };

  /**
   * GPGAuth Verify Step
   *
   */
  verify() {
    var _this = this;
    var decoder = new StringDecoder('utf8');
    var token = this.generateVerifyToken();

    this.log(i18n.__('Authenticating with key: ') + this.user.privateKey.fingerprint);
    Gpg.encrypt(token, ['--armor','--recipient', this.user.privateKey.fingerprint], function(error, buffer) {
      if(error != undefined) {
        throw error;
      }
      var encrypted = decoder.write(buffer);
      _this.request
        .post({
          url: _this.URL_VERIFY,
          form: {
            'data[gpg_auth][keyid]' : _this.user.privateKey.fingerprint,
            'data[gpg_auth][server_verify_token]' : encrypted
          }
        })
        .on('response', function(response) {
          if( _this.serverResponseHealthCheck('verify', response) instanceof Error) {
            return _this.error(r.message);
          }
          return _this.success(i18n.__('server identify verified!'));

        })
        .on('error', function(error) {
          return _this.error(i18n.__('Error: could not connect to ') + _this.URL_VERIFY);
        })

    });

  }
}

module.exports = GpgAuthController;