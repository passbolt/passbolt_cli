"use strict";

var XRegExp = require('xregexp');
var jsSHA = require('jssha');
var randomBytes = require('crypto').randomBytes;

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

}

module.exports = Crypto;