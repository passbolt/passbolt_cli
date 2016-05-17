/**
 * Passbolt GPG Authentication Command
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var program = require('commander');
var GpgAuthController = require('./app/controllers/gpgAuthController.js');

/**
 * Index.js
 */
program
  .usage('[options] [login|logout]', 'Authentication actions, login or logout')
  .option('-u, --fingerprint <fingerprint>', 'The user key fingerprint to authenticate with')
  .option('-p, --passphrase <passphrase>', 'The key passphrase')
  .option('-v, --verbose', 'Display additional debug information')
  .option('-f, --force', 'Force authentication even if not needed')
  .parse(process.argv);

// Check what action was given or use login as default
var action = 'login';
if (program.args.length) {
  action = program.args[0];
}

var gpgAuth = new GpgAuthController(program, process.argv);

switch (action) {
  case 'logout':
    gpgAuth
      .logout()
      .then(function(){
        process.exit(1);
      });
    break;
  case 'login':
  default:
    gpgAuth
      .login()
      .then(function(){
        process.exit(1);
      });
    break;
}
