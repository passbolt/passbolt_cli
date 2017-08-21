/**
 * Authentication Controller
 *
 * @copyright (c) 2017 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var CliController = require('./cliController.js');
var Domain = require('../models/domain.js');
var Crypto = require('../models/crypto.js');
var User = require('../models/user.js');
var GpgAuthToken = require('../models/gpgAuthToken.js');
var GpgAuthHeader = require('../models/gpgAuthHeader.js');
var i18n = require('../models/i18n.js');
var CookieStore = require('tough-cookie-file-store');
var path = require('path');

class GpgAuthController extends CliController {

  /**
   * Constructor
   */
  constructor (program, argv) {
    super(program, argv);
    this._parseProgramArg(program, argv);
    this.appDir = path.dirname(require.main.filename);

    // URLs
    var baseUrl = this.domain.url + '/auth/';
    this.URL_VERIFY = baseUrl + 'verify.json';
    this.URL_CHECKSESSION = baseUrl + 'checkSession.json';
    this.URL_LOGIN = baseUrl + 'login.json';
    this.URL_LOGOUT = baseUrl + 'logout';

    // Session cookie
    this.COOKIE_FILE = this.appDir + '/app/tmp/cookie.json';
    this.cookie = new CookieStore(this.COOKIE_FILE);
    this.cookieJar = this._request.jar(this.cookie);
    this._request.defaults({jar:this.cookieJar});
  }

  /**
   * Is authentication required, or are we already logged in?
   * @returns {boolean}
   */
  authRequired() {
    var _this = this;

    if(_this.force) {
      this._clearCookie();
      return Promise.resolve(true)
    }

    if(_this.cookie.isEmpty()) {
      _this.log('No authentication cookie found', 'verbose');
      return Promise.resolve(true);
    }

    if(_this.cookie.isExpired()) {
      _this.log('Cookie is expired', 'verbose');
      //this._clearCookie();
      return Promise.resolve(true);
    }

    return _this.get({
        url: _this.URL_CHECKSESSION,
        jar: _this.cookieJar
      })
      .then(function(response) {
        return(response.statusCode !== 200);
      })
      .catch(function(err) {
        _this.error(err);
      });
  }

  /**
   * GPGAuth Verify Step
   */
  verify() {
    var _this = this;
    this._generateVerifyToken();

    return Crypto
      .encrypt(this.domain.publicKey.fingerprint, this.token)
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
        return _this._onVerifyResponse(results);
      })
      .catch(function(err) {
        throw err;
      });
  }

  /**
   * Perform GPG Auth Login
   */
  login() {
    var _this = this;

    return this.authRequired()
      .then(function(isRequired) {
        if(!isRequired) {
          _this.log('GPGAuth Skipping, you are already logged in', 'verbose');
          return Promise.resolve(true);
        } else {
          _this.log('GPGAuth login start with fingerprint ' + _this.user.privateKey.fingerprint, 'verbose');
          // Stage 0 - verify the server identity
          return _this.verify()
            .then(function(response) {
              // Stage 1 - get a token to prove identity
              return _this._stage1();
            })
            .then(function(userAuthToken) {
              // Stage 2 - send back the decrypted token
              return _this._stage2(userAuthToken);
            })
            .then(function(response) {
              // Final stage - set the cookie and done!
              var cookie = _this._request.cookie(response.headers['set-cookie'][0]);
              _this.cookieJar.setCookie(cookie, _this.domain.url);
              _this.log('GPGAuth you are now logged in', 'verbose');
              return true;
            })
            .catch(function(err) {
              _this.log('GPGAuth Error during login', 'verbose');
              _this.error(err);
            });
          }
      });
  }

  /**
   * Perform GPG Auth Logout
   */
  logout() {
    var _this = this;

    return _this.get({
        url: _this.URL_LOGOUT,
        jar: _this.cookieJar
      })
      .then(function(response) {
        _this._serverResponseHealthCheck('logout', response);
        _this._clearCookie();
        return true;
      })
      .catch(function(err) {
        _this.error(err);
      });
  }

  /**
   * Check if there is an active session
   */
  check() {
    var _this = this;
    return _this.get({
      url: _this.URL_CHECKSESSION,
      jar: _this.cookieJar
    })
    .then(function(response) {
      var r = JSON.parse(response.body);
      if(r.header.status === 'success') {
        console.log('You are already logged in.');
      } else {
        console.log('You are not logged in.');
      }
    });
  }

  /* ==================================================
   *  Controller helpers
   * ==================================================
   */
  /**
   * Clear cookies if any
   */
   _clearCookie() {
    try {
      require('fs').unlinkSync(this.COOKIE_FILE);
    } catch(e) {}
   }

  /**
   * Parse program arguments
   * @param program
   * @param argv
   * @private
   */
  _parseProgramArg(program, argv) {

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
      this.domain = program.domain;
    }

    if(program !== undefined && program.passphrase === undefined) {
      // if no passphrase is given but is needed
      // a gpg prompt will be triggered by gpg itself
    } else {
      this.passphrase = program.passphrase;
    }

    if (program !== undefined && program.force === undefined) {
      this.force = false;
    } else {
      this.force = true;
    }
  }

  /**
   * Generate random verification token to be decrypted by the server
   * @returns {string}
   */
  _generateVerifyToken () {
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
  _serverResponseHealthCheck(step, response) {
    var error_msg;

    // Check if the HTTP status is OK
    if(response.statusCode !== 200) {
      return new Error(i18n.__('There was a problem when trying to communicate with the server') +
        ' (HTTP Code:' + response.status +')');
    }

    // Check if there is GPGAuth error flagged by the server
    if(response.headers['x-gpgauth-error'] != undefined) {
      error_msg = i18n.__('The server rejected the verification request.') + response.headers['x-gpgauth-debug'];
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
   * Process a verify step response
   * @param response
   * @returns {*}
   */
  _onVerifyResponse(response) {
    // check headers
    var r = this._serverResponseHealthCheck('verify', response);
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

  /**
   * GPGAuth stage 1
   * @returns {Promise.<T>}
   * @private
   */
  _stage1() {
    var _this = this;
    return _this.post({
      url: _this.URL_LOGIN,
      form: {
        'data[gpg_auth][keyid]': _this.user.privateKey.fingerprint
      }
    })
    .then(function(response) {
      // perform protocol health checks on server response
      var r = _this._serverResponseHealthCheck('login', response);
      if(r instanceof Error) {
        throw new Error(r.message);
      }
      // cleanup the encrypted auth string
      var compat = require('../lib/phpjs.js');
      var encryptedAuthToken = compat.stripslashes(compat.urldecode(response.headers['x-gpgauth-user-auth-token']));

      // decrypt
      var options;
      if(_this.passphrase !== undefined) {
        options = ['--passphrase', _this.passphrase];
      }
      return Crypto.decrypt(encryptedAuthToken, options);
    })
    .then(function(userAuthToken) {
      // validate decrypted token
      var r = GpgAuthToken.validate('token', userAuthToken);
      if(r instanceof Error) {
        throw new Error(r.message);
      }
      // stage 1 success
      return userAuthToken;
    })
    .catch(function(err) {
      _this.log(err);
      throw err;
    });
  }

  /**
   * Stage 2 - Send back the decrypted token and get a cookie
   * @param userAuthToken
   * @returns {Promise.<T>}
   * @private
   */
  _stage2 (userAuthToken) {
    var _this = this;
    return _this.post({
      url: _this.URL_LOGIN,
      form: {
        'data[gpg_auth][keyid]': _this.user.privateKey.fingerprint,
        'data[gpg_auth][user_token_result]' : userAuthToken
      }
    }).then(function(response){
      // perform protocol health checks on server response
      var r = _this._serverResponseHealthCheck('stage2', response);
      if(r instanceof Error) {
        throw new Error(r.message);
      }
      return response;
    }).catch(function(err) {
      _this.log(err);
      throw err;
    });
  }
}

module.exports = GpgAuthController;