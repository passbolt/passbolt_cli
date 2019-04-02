/**
 * Resource Controller
 *
 * @copyright (c) 2019 Passbolt SA
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
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
