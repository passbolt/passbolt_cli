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
const Model = require('./model.js');
const Config = require('./config.js');
const Key = require('./key.js');
const i18n = require('./i18n.js');
const validator = require('validator');

/**
 * Domain model constructor
 */
class Domain extends Model {
  constructor(url) {
    super();
    if (url) {
      this.url = url;
    }
  }

  /**
   * Validate user fields individually
   * @param field string
   * @param value string
   * @return boolean true or Error
   */
  static validate(field, value) {
    switch (field) {
      case 'url':
        if (typeof value === 'undefined' || value === '') {
          return new Error(i18n.__('The url should not be be empty'));
        }
        if (!validator.isURL(value)) {
          return new Error('This is not a valid domain url');
        }
        break;
      default:
        return new Error(i18n.__(`No validation defined for field: ${field}`));
    }
    return true;
  }

  /**
   * Set the domain url
   * @param url
   * @return void
   * @throw Error validation error
   */
  set url(url) {
    const result = Domain.validate('url', url);
    if (result === true) {
      this._url = url;
      return;
    }
    throw result;
  }

  /**
   * Return the domain url and optionally load it from config if there is none
   * @returns {*}
   */
  get url() {
    if (this._url == null) {
      const r = this.__loadDefault();
      if (r instanceof Error) {
        return undefined;
      }
    }
    return this._url;
  }

  /**
   * Reset a domain as per file configuration
   * @returns {Error} or true
   * @private
   */
  __loadDefault() {
    const config = Config.get();
    if (config.domain.baseUrl === undefined) {
      return new Error(i18n.__("Can not read domain url from file"));
    }
    this._url = config.domain.baseUrl;
    if (config.domain.publicKey !== undefined) {
      try {
        this.publicKey = new Key(config.domain.publicKey);
      } catch (Error) {
        console.warn('Invalid public key fingerprint set for the server.')
      }
    }
    return true;
  }
}

module.exports = Domain;
