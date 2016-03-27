/**
 * Controller
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

class Controller {
  constructor() {
    this.request = require('request');
  }

  log(msg) {
    console.log(msg);
  }

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

  success(msg) {
    this.log(msg);
    process.exit(0);
  }
}

module.exports = Controller;
