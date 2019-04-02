/**
 * Passbolt Search Command
 *
 * @copyright (c) 2019 Passbolt SA
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var program = require('commander');
var UserController = require('./app/controllers/userController');
var UserIndexView = require('./app/views/users/index');
var Coercion = require('./app/lib/coercion');

/**
 * Index.js
 */
program
  .usage('[options]', 'Get the list of users')
  .option('-u, --fingerprint <fingerprint>', 'The user key fingerprint to authenticate with')
  .option('-p, --passphrase <passphrase>', 'The key passphrase')
  .option('--columns <items>', 'Coma separated columns to display', Coercion.list)
  .option('-v, --verbose', 'Display additional debug information')
  .parse(process.argv);

const userController = new UserController(program, process.argv);
userController
  .loginIfNeeded()
  .then(function(){
    return userController.index();
  })
  .then(function(data) {
    var view = new UserIndexView(data, program.columns);
    view.render();
    process.exit(0);
  });
