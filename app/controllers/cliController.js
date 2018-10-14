/**
 * Command Line Interface Controller
 *
 * @copyright (c) 2018 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
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
      this._prompt.get(schema, function (err, result) {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }
}

module.exports = CliController;
