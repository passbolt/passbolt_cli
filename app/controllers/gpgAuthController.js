/**
 * Authentication Controller
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var Domain = require('../models/domain.js');
var Crypto = require('../models/crypto.js');
var User = require('../models/user.js');
var GpgAuthToken = require('../models/gpgAuthToken.js');
var GpgAuthHeader = require('../models/gpgAuthHeader.js');
var CliController = require('./cliController.js');
var i18n = require('../models/i18n.js');

class GpgAuthController extends CliController {

  /**
   * Constructor
   */
  constructor (program, argv) {
    super();

    if(program !== undefined && program.fingerprint !== undefined) {
      this.user = new User({
        privateKey : {
          fingerprint: program.fingerprint
        }
      });
    } else {
      this.user = new User();
    }

    if(program !== undefined && program.domain === undefined) {
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
   var t = new GpgAuthToken();
   this.token = t.token;
   return this.token;
  }

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
    this.generateVerifyToken();

    return Crypto
      .encrypt(this.user.privateKey.fingerprint, this.token)
      .then(function(encrypted) {
        return _this.post({
          url: _this.URL_VERIFY,
          form: {
            'data[gpg_auth][keyid]' : _this.user.privateKey.fingerprint,
            'data[gpg_auth][server_verify_token]' : encrypted
          }
        });
      })
      .then(function(results) {
        return _this.onVerifyResponse(results);
      })
      .catch(function(err) {
        console.log('catch');
        throw err;
      });
  }

  /**
   * Perform GPG Auth Login
   */
  login() {
    var _this = this;
    this.log(i18n.__('Authenticating with key: ') + this.user.privateKey.fingerprint);

    return _this.verify()
      .then(function(response){

        console.log(response.headers);
        return true;
      })
      .catch(function(err) {
        _this.error(err);
      });
  }

  /**
   * Process a verify step response
   * @param response
   * @returns {*}
   */
  onVerifyResponse(response) {

    // check headers
    var r = this.serverResponseHealthCheck('verify', response);
    if(r instanceof Error) {
      throw new Error(r.message);
    }
    // check token
    var token = response.headers['x-gpgauth-verify-response'];
    r = GpgAuthToken.validate('token', token);
    if( r instanceof Error) {
      throw new Error(i18n.__('Error: GPGAuth verify step failed. Maybe your user does not exist or have been deleted.'));
    }
    if(this.token !== undefined && token !== this.token) {
      throw new Error(i18n.__('Error: The server was unable to identify. GPGAuth tokens do not match.'));
    }
    return response;
  }
}

module.exports = GpgAuthController;