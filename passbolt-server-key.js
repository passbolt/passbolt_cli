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
const ServerKeyController = require('./app/controllers/serverKeyController.js');

/**
 * Get and display the server public key
 */
(async function() {
  const program = new Command();
  program
    .usage('[options]', 'Get the server key')
    .option('--fingerprint', 'Display the fingerprint')
    .option('--armored-key', 'Display the armored block (default)')
    .option('--skipCertificateValidation', 'Ignore server certificate is verification errors')
    .option('--domain <domain>', 'The URL of the domain to get the key from')
    .option('-v, --verbose', 'Display additional debug information')
    .parse(process.argv);

  if (!program.fingerprint && !program.armoredKey) {
    program.armoredKey = true;
  }

  let serverKeyController;
  try {
    serverKeyController = new ServerKeyController(program, process.argv);
  } catch (error) {
    console.error('Could not fetch server key. Please provide a domain in app/config/config.json or using --domain.');
    process.exit(1);
  }
  let response;
  try {
    response = await serverKeyController.getPublicKey();
  } catch ( error) {
    console.error(error.message);
    process.exit(1);
  }

  if (program.fingerprint) {
    console.log(response.body.fingerprint);
  }
  if (program.armoredKey) {
      console.log(response.body.keydata);
  }
})();
