/**
 * Command Line Interface Controller
 *
 * @copyright (c) 2017 Passbolt SARL
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
  constructor(program, argv) {
    super(program, argv);
    this.prompt = prompt;
    this.prompt.colors = false;
    this.prompt.message = '';
    this.prompt.delimiter = ': ';
  }

  /**
   * Log a message in console
   * @param msg
   * @param priority
   */
  log(msg, priority) {
    if(priority === undefined || (priority === 'verbose' && this._verbose)) {
      console.log(msg);
    }
  }

  /**
   * Handle an error
   * @param error
   */
  error(error) {
    if(error instanceof Error) {
      this.log(error.message);
    }
    else if(typeof error === 'string') {
      this.log(error);
    }
    else {
      this.log(error);
    }
    process.exit(1);
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
      if (err instanceof Error) { return _this.onPromptError(err); }
      console.log('  Result: ' + result.username);
    });
  };

  /**
   * On prompt error handler
   * This event can happen for example if a user press ctrl + c while prompted
   * @param err Error
   */
  onPromptError (err) {
    // if the user cancel the input
    // we do nothing
    this.error(err);
  };

}

module.exports = CliController;
