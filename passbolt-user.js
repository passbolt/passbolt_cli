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
const {Command} = require('commander');
const UserController = require('./app/controllers/userController.js');
const UserGetView = require('./app/views/users/get.js');

/**
 * User get
 */
(async function () {
  const program = new Command();
  program
    .usage('[options] <uuid>', 'Display the info for a given user')
    .option('-u, --fingerprint <fingerprint>', 'The user key fingerprint to authenticate with')
    .option('-p, --passphrase <passphrase>', 'The key passphrase')
    .option('-v, --verbose', 'Display additional debug information')
    .parse(process.argv);

  const userController = new UserController(program, process.argv);
  await userController.loginIfNeeded();
  try {
    const data = await userController.view(program.args[0]);
    const view = new UserGetView(data);
    view.render();
  } catch (err) {
    userController.error(err);
  }
})();
