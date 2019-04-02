"use strict";

var program = require('commander');
var pjson = require('./package.json');

program
  .version(pjson.version)
  .command('auth', 'Authentication actions, login or logout')
  .command('get', 'View the OpenPGP data block of a given resource')
  .command('find', 'Find one or more resources')
  .command('keyring', 'Synchronize public keys')
  .command('users', 'List all users')
  .command('user', 'View one user details')
  .parse(process.argv);

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});