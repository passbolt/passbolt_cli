/**
 * Authentication Controller
 *
 * @copyright (c) 2019 Passbolt SA
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
const GpgAuthController = require('./gpgAuthController.js');

class KeyringController extends GpgAuthController {
  /**
   * Constructor
   * @param program
   */
  constructor(program) {
    super(program);
  }

  /**
   * Return the server public key
   * Useful during setup, to create the config files
   *
   * @returns {Promise<*>}
   */
  async getServerPublicKey() {
    const url = `${this.domain.url}/auth/verify.json?api-version=v2`;
    const response = await this.get({url, jar: this.cookieJar});
    try {
      return this._parseResponse(response);
    } catch (error) {
      this.error(error);
    }
  }
}

module.exports = KeyringController;