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
const i18n = require('./i18n.js');

class Model {
  /**
   * Validate user fields individually
   *
   * @param field
   * @param value
   * @returns {Error|boolean}
   */
  static validate(field, value) {
    return new Error(i18n.__(`No validation defined for field: ${field}: ${value}`));
  }
}

module.exports = Model;
