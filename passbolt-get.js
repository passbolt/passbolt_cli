/**
 * Passbolt Get Secret
 *
 * @copyright (c) 2017 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var program = require('commander');
var ResourceController = require('./app/controllers/resourceController.js');
var GetView = require('./app/views/resources/get.js');

/**
 * Index.js
 */
program
  .usage('[options] <uuid>', 'Display the OpenPGP block a given secret')
  .option('-u, --fingerprint <fingerprint>', 'The user key fingerprint to authenticate with')
  .option('-p, --passphrase <passphrase>', 'The key passphrase')
  .option('-v, --verbose', 'Display additional debug information')
  .parse(process.argv);

var resourceController = new ResourceController(program, process.argv);
resourceController
  .login()
  .then(function(){
    return resourceController.view(program.args[0]);
  })
  .then(function(data) {
    var view = new GetView(data);
    view.render();
    process.exit(0);
  })
  .catch(function(err) {
    resourceController.error(err);
  });
