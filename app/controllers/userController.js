/**
 * User Controller
 *
 * @copyright (c) 2019 Passbolt SA
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
const AppController = require('./appController.js');

class UserController extends AppController {
  getName() {
    return 'users';
  }
}

module.exports = UserController;
