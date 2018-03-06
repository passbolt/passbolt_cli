/**
 * Passbolt User Get
 *
 * @copyright (c) 2018 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var program = require('commander');
var UserController = require('./app/controllers/userController.js');
var UserGetView = require('./app/views/users/get.js');

/**
 * Index.js
 */
program
  .usage('[options] <uuid>', 'Display the info for a given user')
  .option('-u, --fingerprint <fingerprint>', 'The user key fingerprint to authenticate with')
  .option('-p, --passphrase <passphrase>', 'The key passphrase')
  .option('-v, --verbose', 'Display additional debug information')
  .parse(process.argv);

var userController = new UserController(program, process.argv);
userController
  .login()
  .then(function(){
    return userController.view(program.args[0]);
  })
  .then(function(data) {
    var view = new UserGetView(data);
    view.render();
    process.exit(0);
  })
  .catch(function(err) {
    userController.error(err);
  });
