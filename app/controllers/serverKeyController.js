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
const CliController = require('./cliController.js');
const Domain = require('../models/domain.js');

class ServerKeyController extends CliController {
  /**
   * Constructor
   * @param program
   */
  constructor(program) {
    try {
      super(program);
    } catch (error) {
      // config loading failed, still try to proceed
      // maybe program.domain is set and valid
    }
    
    const { domain, skipCertificateValidation } = program.opts();
    if (domain) {
      this.domain = new Domain(domain);
      if (skipCertificateValidation) {
        this._agentOptions = {rejectUnauthorized: false};
      }
    } else {
      // Will throw an exception if no config is present
      this.domain = new Domain();
    }
  }

  /**
   * Return the server public key
   * Useful during setup, to create the config files
   *
   * @returns {Promise<*>}
   */
  async getPublicKey() {
    const url = `${this.domain.url}/auth/verify.json?api-version=v2`;
    const response = await this.get({url});
    try {
      return this._parseResponse(response);
    } catch (error) {
      this.error(error);
    }
  }
}

module.exports = ServerKeyController;
