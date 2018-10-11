/**
 * Passbolt Search Command
 *
 * @copyright (c) 2018 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var program = require('commander');
var UserController = require('./app/controllers/userController.js');
var UserIndexView = require('./app/views/users/index.js');

/**
 * Index.js
 */
program
  .usage('[options]', 'Get the list of users')
  .option('-u, --fingerprint <fingerprint>', 'The user key fingerprint to authenticate with')
  .option('-p, --passphrase <passphrase>', 'The key passphrase')
  .option('-v, --verbose', 'Display additional debug information')
  .parse(process.argv);

var userController = new UserController(program, process.argv);
userController
  .loginIfNeeded()
  .then(function(){
    return userController.index();
  })
  .then(function(data) {
    var view = new UserIndexView(data);
    view.render();
    process.exit(0);
  });
