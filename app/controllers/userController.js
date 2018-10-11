/**
 * User Controller
 *
 * @copyright (c) 2018 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */


const AppController = require('./appController.js');

class UserController extends AppController {
  getName() {
    return 'users';
  }
}

module.exports = UserController;
