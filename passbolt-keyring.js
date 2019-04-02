/**
 * Passbolt GPG Keys Synchronization Commands
 *
 * @copyright (c) 2019 Passbolt SA
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var program = require('commander');
var KeyringController = require('./app/controllers/keyringController.js');

/**
 * Index.js
 */
program
  .usage('[options] [server-public-key]', 'Keyring synchronization actions')
  .option('--display-fingerprint', 'Display the fingerprint')
  .option('--display-armored', 'Display the armored block')
  .option('--import', 'Import the key(s) in the GnuPG keyring')
  .option('-v, --verbose', 'Display additional debug information')
  .parse(process.argv);

// Check what action was given
let action;
if (program.args.length) {
  action = program.args[0];
} else {
  console.error('no command given!');
  process.exit(1);
}

const keyringController = new KeyringController(program, process.argv);

switch (action) {
  case 'server-public-key':
    keyringController
      .getServerPublicKey()
      .then(function(response){
        if (program.displayFingerprint) {
          console.log(response.body.fingerprint);
        }
        if (program.displayArmored) {
          console.log(response.body.keydata);
        }
        process.exit(0);
      });
    break;

}
