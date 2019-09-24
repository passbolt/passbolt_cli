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
const i18n = require('./i18n.js');

/**
 * Domain model constructor
 */
class Key extends Model {
  constructor(key) {
    super();
    if (key.fingerprint !== undefined) {
      this.fingerprint = key.fingerprint.toUpperCase().replace(/\s/g, '');
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
      case 'fingerprint':
        return (value.match(/[0-9A-F]{40}/g) !== null);
      default:
        return new Error(i18n.__(`No validation defined for field: ${field}`));
    }
  }

  /**
   * Return the key id
   * @returns {*}
   */
  get fingerprint() {
    return this._fingerprint;
  }

  /**
   * Set a fingerprint
   * @param fingerprint
   */
  set fingerprint(fingerprint) {
    const result = Key.validate('fingerprint', fingerprint);
    if (result === true) {
      this._fingerprint = fingerprint;
      return;
    }
    throw result;
  }
}

module.exports = Key;
