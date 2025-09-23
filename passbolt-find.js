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
const ResourceIndexView = require('./app/views/resources/index.js');
const {list} = require('./app/lib/coercion');

/**
 * Passbolt Search Command
 */
(async function () {
  const program = new Command();
  program
    .usage('[options]', 'Search and list resources')
    .option('-u, --fingerprint <fingerprint>', 'The user key fingerprint to authenticate with')
    .option('-p, --passphrase <passphrase>', 'The key passphrase')
    .option('-o, --output <output>', 'The output format. One of: (columns,json,yaml)')
    .option('--columns <items>', 'Coma separated columns to display', list)
    .option('-v, --verbose', 'Display additional debug information')
    .parse(process.argv);

  const resourceController = new ResourceController(program, process.argv);
  await resourceController.loginIfNeeded();
  try {
    let data = await resourceController.index();
    const view = new ResourceIndexView(data, program.opts().output, program.opts().columns);
    view.render();
  } catch (err) {
    resourceController.error(err);
  }
})();
