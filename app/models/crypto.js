/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 */
const Config = require('./config');
const Gpg = require('gpg');
const XRegExp = require('xregexp');
const jsSHA = require('jssha');
const randomBytes = require('crypto').randomBytes;
const StringDecoder = require('string_decoder').StringDecoder;

class Crypto {
  /**
   * Generate a random hexadecimal string of a specified length
   * @param size int
   * @returns {*}
   */
  static generateRandomHex(size) {
    if (size === undefined) {
      return new Error('generateRandomHex size is undefined');
    }
    let text = '';
    const possible = 'ABCDEF0123456789';
    const random_array = randomBytes(size);
    for (let i = size; i > 0; i--) {
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
    let hashStr;

    // Generate a random hash if no seed is provided
    if (typeof seed === 'undefined') {
      hashStr = Crypto.generateRandomHex(32);
    } else {
      // Create SHA hash from seed.
      const shaObj = new jsSHA('SHA-1', 'TEXT');
      shaObj.update(seed);
      hashStr = shaObj.getHash('HEX').substring(0, 32);
    }
    // Build a uuid based on the hash
    const search = XRegExp('^(?<first>.{8})(?<second>.{4})(?<third>.{1})(?<fourth>.{3})(?<fifth>.{1})(?<sixth>.{3})(?<seventh>.{12}$)');
    const replace = XRegExp('${first}-${second}-3${fourth}-a${sixth}-${seventh}');

    // Replace regexp by corresponding mask, and remove / character at each side of the result.
    const uuid = XRegExp.replace(hashStr, search, replace).replace(/\//g, '');

    if (lowercase === false) {
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
    const promise = new Promise(((resolve, reject) => {
      const p = {
        resolve,
        reject
      };

      const options = ['--armor', '--recipient', recipient];
      const config = Config.get();
      if (config.gpg !== undefined && config.gpg.trust !== undefined) {
        if (config.gpg.trust === 'always') {
          options.push('--trust-model');
          options.push('always');
        }
      }
      Gpg.encrypt(msg, options, (error, buffer) => {
        if (error != undefined) {
          return p.reject(error);
        }
        const decoder = new StringDecoder('utf8');
        return p.resolve(decoder.write(buffer));
      });
    }));
    return promise;
  }


  /**
   * Decrypt a msg with a given key
   * @param msg string message to decrypt
   * @returns {Promise}
   */
  static decrypt(msg, options) {
    const promise = new Promise(((resolve, reject) => {
      const p = {
        resolve,
        reject
      };

      Gpg.decrypt(msg, options, (error, decrypted) => {
        if (error != undefined) {
          return p.reject(error);
        }
        return p.resolve(decrypted.toString('utf8'));
      });
    }));
    return promise;
  }
}

module.exports = Crypto;
