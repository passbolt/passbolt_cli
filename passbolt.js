"use strict";

var program = require('commander');
var pjson = require('./package.json');

program
  .version(pjson.version)
  .command('info', 'default command', {noHelp: true, isDefault: true})
  .command('auth', 'Authentication actions, login or logout')
  .command('users', 'Find one or more users')
  .command('resources', 'Find one or more resources')
  .parse(process.argv);

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});