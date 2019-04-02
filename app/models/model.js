/**
 * Model base class
 *
 * @copyright (c) 2019 Passbolt SA
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
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
