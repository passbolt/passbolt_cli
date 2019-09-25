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
const Key = require('./key.js');
const Config = require('./config.js');
const i18n = require('./i18n.js');

/**
 * The class that deals with users.
 */
class User extends Model {
  /**
   * Constructor
   * @throw Error if provided key fingerprint is invalid or loadDefault fails
   * @param user object
   */
  constructor(user) {
    super();
    if (user !== undefined && user.privateKey !== undefined) {
      this._key = new Key(user.privateKey);
    } else {
      const e = this.__loadDefault();
      if (e instanceof Error) {
        throw e;
      }
    }
  }

  /**
   * Return the private key of the user
   * @returns {*}
   */
  get privateKey() {
    return this._key;
  }

  /**
   * Reset a domain as per file configuration
   * @returns {Error} or true
   * @private
   */
  __loadDefault() {
    const config = Config.get();
    if (config instanceof Error) {
      return config;
    }

    if (!config || !config.user || !config.user.privateKey) {
      return new Error(i18n.__("Can not read user key from file"));
    }
    this._key = new Key(config.user.privateKey);
    return true;
  }
}

module.exports = User;
