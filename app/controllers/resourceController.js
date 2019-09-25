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
const AppController = require('./appController.js');

class ResourceController extends AppController {
  getName() {
    return 'resources';
  }

  /**
   * View Action
   * @param id
   * @param options
   * @returns {Promise<any>}
   */
  view(id, options) {
    options = 'contain[secret]=1';
    return super.view(id, options);
  }
}

module.exports = ResourceController;
