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
const program = require('commander');
const pjson = require('./package.json');

program
  .version(pjson.version)
  .command('auth', 'Authentication actions, login or logout')
  .command('get', 'View the OpenPGP data block of a given resource')
  .command('find', 'Find one or more resources')
  .command('users', 'List all users')
  .command('user', 'View one user details')
  .parse(process.argv);

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});