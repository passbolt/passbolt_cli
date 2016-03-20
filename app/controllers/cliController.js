/**
 * Command Line Interface Controller
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var Controller = require('./controller.js');
var User = require('../models/user.js');
var i18n = require('../models/i18n.js');
var prompt = require('prompt');

class CliController extends Controller {

  /**
   * Constructor
   */
  constructor() {
    super();
    this.prompt = prompt;
    this.prompt.colors = false;
    this.prompt.message = '';
    this.prompt.delimiter = ': ';
  }

  /**
   * Trigger a prompt and request username input
   * @return void
   */
  promptUsername() {

    this.prompt.start();
    var properties = [
      {
        name: 'username',
        required: true,
        message : i18n.__('a username is required'),
        conform: function(value) {
          var result = User.validate('username', value);
          if (result === true) {
            return true;
          } else {
            properties[0].message = result.message;
            return false;
          }
        }
      }
    ];
    var _this = this;
    this.prompt.get(properties, function (err, result) {
      if (err) { return _this.onPromptError(err); }
      console.log('  Result: ' + result.username);
    });
  };

  /**
   * On prompt error handler
   * This event can happen for example if a user press ctrl + c while prompted
   * @param err Error
   * @returns int 1 exit code
   */
  onPromptError (err) {
    // if the user cancel the input
    // we do nothing
    console.log(err.message);
    return 1;
  };

}

module.exports = CliController;
