/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 */
const Controller = require('./controller.js');
const prompt = require('prompt');

class CliController extends Controller {
  /**
   * Constructor
   */
  constructor(program) {
    super(program);
    this._prompt = prompt;
    this._prompt.colors = false;
    this._prompt.message = '';
    this._prompt.delimiter = ': ';
  }

  /**
   * Log a message in console
   * @param msg
   * @param priority
   */
  log(msg, priority) {
    if (priority === undefined || (priority === 'verbose' && this._verbose)) {
      console.log(msg);
    }
  }

  /**
   * Handle an error
   * @param error
   */
  error(error) {
    if (error instanceof Error) {
      this.log(error.message);
    } else if (typeof error === 'string') {
      this.log(error);
    } else {
      this.log(error);
    }
    process.exit(1);
  }

  /**
   * Capture data from command line
   * @param schema
   * @returns {Promise<any>}
   */
  async prompt(schema) {
    return new Promise((resolve, reject) => {
      this._prompt.start();
      this._prompt.get(schema, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }
}

module.exports = CliController;
