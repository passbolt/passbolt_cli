/**
 * Resource Controller
 *
 * @copyright (c) 2017 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var AppController = require('./appController.js');

class ResourceController extends AppController {

  getName() {
    return 'resources';
  }

  /**
   * View Action
   * @param id
   * @param string options
   * @returns {Promise.<T>}
   */
  view(id, options) {
    var options = 'contain[secret]=1';
    return super.view(id, options);
  }
}

module.exports = ResourceController;