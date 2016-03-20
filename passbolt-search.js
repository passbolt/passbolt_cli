/**
 * Passbolt Search Command
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var program = require('commander');
var CliController = require('./app/controllers/cliController.js');
var GpgAuthController = require('./app/controllers/gpgAuthController.js');

/**
 * Index.js
 */
program
  .arguments('<password>')
  .option('-u, --username <username>', 'The user to authenticate as')
  .action(function(password) {

    //var file = file;
    //var cli = new CliController();
    //cli.promptUsername();

    var gpgAuth = new GpgAuthController();
    gpgAuth.verify();

  })
  .parse(process.argv);
