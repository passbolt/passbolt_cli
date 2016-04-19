"use strict";

var Gpg = require('gpg');
var XRegExp = require('xregexp');
var jsSHA = require('jssha');
var randomBytes = require('crypto').randomBytes;
var StringDecoder = require('string_decoder').StringDecoder;

class Crypto {

  /**
   * Generate a random hexadecimal string of a specified length
   * @param size int
   * @returns {*}
   */
  static generateRandomHex (size) {
    if(size === undefined) {
      return new Error('generateRandomHex size is undefined');
    }
    var text = '';
    var possible = 'ABCDEF0123456789';
    var random_array = randomBytes(size);
    for(var i=size; i > 0; i--) {
      text += possible.charAt(Math.floor(random_array[i] % possible.length));
    }
    return text;
  }

  /**
   * Create a predictable uuid from a sha1 hashed seed
   * @param seed string
   * @param lowercase boolean, default true
   * @returns uuid string
   */
  static uuid(seed, lowercase) {
    var hashStr;

    // Generate a random hash if no seed is provided
    if(typeof seed === 'undefined') {
      hashStr = Crypto.generateRandomHex(32);
    }
    else {
      // Create SHA hash from seed.
      var shaObj = new jsSHA('SHA-1', 'TEXT');
      shaObj.update(seed);
      hashStr = shaObj.getHash('HEX').substring(0, 32);
    }
    // Build a uuid based on the hash
    var search = XRegExp('^(?<first>.{8})(?<second>.{4})(?<third>.{1})(?<fourth>.{3})(?<fifth>.{1})(?<sixth>.{3})(?<seventh>.{12}$)');
    var replace = XRegExp('${first}-${second}-3${fourth}-a${sixth}-${seventh}');

    // Replace regexp by corresponding mask, and remove / character at each side of the result.
    var uuid = XRegExp.replace(hashStr, search, replace).replace(/\//g, '');

    if(lowercase === false) {
      return uuid.toUpperCase();
    } else {
      return uuid.toLowerCase();
    }
  }

  /**
   * Encrypt a msg with a given key
   * @param recipient string public key fingerprint
   * @param msg string message to encrypt
   * @returns {Promise}
   */
  static encrypt(recipient, msg) {
    var promise = new Promise( function (resolve, reject) {
      var p = {
        resolve: resolve,
        reject: reject
      };
      Gpg.encrypt(msg, ['--armor','--recipient', recipient], function(error, buffer) {
        if (error != undefined) {
          return p.reject(error);
        }
        var decoder = new StringDecoder('utf8');
        return p.resolve(decoder.write(buffer));
      });
    });
    return promise;
  }


  /**
   * Decrypt a msg with a given key
   * @param msg string message to decrypt
   * @returns {Promise}
   */
  static decrypt(msg, options) {
    var promise = new Promise( function (resolve, reject) {
      var p = {
        resolve: resolve,
        reject: reject
      };
      Gpg.decrypt(msg, options, function(error, decrypted) {
        if (error != undefined) {
          return p.reject(error);
        }
        return p.resolve(decrypted.toString('utf8'));
      });
    });
    return promise;
  }
}

module.exports = Crypto;