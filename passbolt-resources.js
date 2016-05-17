/**
 * Passbolt Search Command
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var program = require('commander');
var ResourceController = require('./app/controllers/resourceController.js');
var ResourceIndexView = require('./app/views/resources/index.js');

/**
 * Index.js
 */
program
  .usage('[options]', 'Search and list resources')
  .option('-u, --fingerprint <fingerprint>', 'The user key fingerprint to authenticate with')
  .option('-p, --passphrase <passphrase>', 'The key passphrase')
  .option('-v, --verbose', 'Display additional debug information')
  .parse(process.argv);

var resourceController = new ResourceController(program, process.argv);
resourceController
  .login()
  .then(function(){
    return resourceController.find();
  })
  .then(function(data) {
    var view = new ResourceIndexView(data);
    view.render();
    process.exit(1);
  });
