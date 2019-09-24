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
const GpgAuthController = require('./app/controllers/gpgAuthController.js');

/**
 * Passbolt GPG Authentication Command
 */
(async function() {
  program
    .usage('[options] [login|logout]', 'Authentication actions, login or logout')
    .option('-u, --fingerprint <fingerprint>', 'The user key fingerprint to authenticate with')
    .option('-p, --passphrase <passphrase>', 'The key passphrase')
    .option('-v, --verbose', 'Display additional debug information')
    .option('-f, --force', 'Force authentication even if not needed')
    .parse(process.argv);

  // Check what action was given or use login as default
  let action = 'login';
  if (program.args.length) {
    action = program.args[0];
  }

  const gpgAuth = new GpgAuthController(program, process.argv);
  switch (action) {
    case 'logout':
      await gpgAuth.logout();
      console.log('logged out');
      break;
    case 'check':
      await gpgAuth.check();
      break;
    case 'login':
    default:
      await gpgAuth.loginIfNeeded();
      break;
  }
})();