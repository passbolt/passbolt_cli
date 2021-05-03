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
const UserIndexView = require('./app/views/users/index.js');
const {list} = require('./app/lib/coercion');

/**
 * User list
 */
(async function () {
  const program = new Command();
  program
    .usage('[options]', 'Get the list of users')
    .option('-u, --fingerprint <fingerprint>', 'The user key fingerprint to authenticate with')
    .option('-p, --passphrase <passphrase>', 'The key passphrase')
    .option('--columns <items>', 'Coma separated columns to display', list)
    .option('-v, --verbose', 'Display additional debug information')
    .parse(process.argv);

  const userController = new UserController(program, process.argv);
  await userController.loginIfNeeded();
  try {
    const data = await userController.index();
    const view = new UserIndexView(data, program.opts().columns);
    view.render();
  } catch (err) {
    userController.error(err);
  }
})();
