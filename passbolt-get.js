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
const ResourceController = require('./app/controllers/resourceController.js');
const GetView = require('./app/views/resources/get.js');

/**
 * Get Secret
 */
(async function () {
  const program = new Command();
  program
    .usage('[options] <uuid>', 'Display the OpenPGP block a given secret')
    .option('-u, --fingerprint <fingerprint>', 'The user key fingerprint to authenticate with')
    .option('-p, --passphrase <passphrase>', 'The key passphrase')
    .option('-v, --verbose', 'Display additional debug information')
    .parse(process.argv);

  const resourceController = new ResourceController(program, process.argv);
  await resourceController.loginIfNeeded();
  try {
    const data = await resourceController.view(program.args[0]);
    const view = new GetView(data);
    view.render();
  } catch (err) {
    resourceController.error(err);
  }
})();
