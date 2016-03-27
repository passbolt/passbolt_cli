/**
 * Passbolt Search Command
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var program = require('commander');
var User = require('./app/models/user.js');
var CliController = require('./app/controllers/cliController.js');
var GpgAuthController = require('./app/controllers/gpgAuthController.js');

/**
 * Index.js
 */
program
  .option('-u, --fingerprint <fingerprint>', 'The user key fingerprint to authenticate with')
  .parse(process.argv);

var gpgAuth;
if(program.fingerprint !== undefined) {
  var user = new User({
    privateKey : {
      fingerprint: program.fingerprint
    }
  });
  gpgAuth = new GpgAuthController(user);
} else {
  gpgAuth = new GpgAuthController();
}

gpgAuth.verify();