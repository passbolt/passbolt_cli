/**
 * Controller
 *
 * @copyright (c) 2019 Passbolt SA
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
const i18n = require('../models/i18n.js');
const Config = require('../models/config.js');

class Controller {
  /**
   * Controller constructor
   * @param program
   */
  constructor(program) {
    const config = Config.get();
    this._request = require('request');
    this._agentOptions = config.agentOptions;
    this._verbose = (program !== undefined && program.verbose !== undefined && program.verbose);
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
   * HTTP POST request
   * @param options
   * @returns {Promise}
   */
  post(options) {
    options.agentOptions = this._agentOptions;
    let result = undefined;
    this.log(`POST ${options.url}`, 'verbose');
    return new Promise((resolve, reject) => {
      try {
        this._request
        .post(options)
        .on('response', response => {
          this.log(response.statusCode, 'verbose');
          result = response;
        })
        .on('data', chunk => {
          if (result.body === undefined) {
            result.body = chunk;
          } else {
            result.body += chunk;
          }
        })
        .on('end', () => {
          resolve(result);
        })
        .on('error', () => {
          const err = new Error(i18n.__('Error: could not connect to ') + options.url);
          reject(err);
        });
      } catch (error) {
        const err = new Error(i18n.__('Error: could not connect to ') + options.url);
        reject(err);
      }
    });
  }

  /**
   * HTTP GET request
   * @param options
   * @returns {Promise}
   */
  get(options) {
    options.agentOptions = this._agentOptions;
    let result = undefined;
    this.log(`GET ${options.url}`, 'verbose');
    return new Promise((resolve, reject) => {
      try {
        this._request
        .get(options)
        .on('response',  response => {
          this.log(response.statusCode, 'verbose');
          result = response;
        })
        .on('data', chunk => {
          if (result.body === undefined) {
            result.body = chunk;
          } else {
            result.body += chunk;
          }
        })
        .on('end', () => {
          resolve(result);
        })
        .on('error', () => {
          const err = new Error(i18n.__('Error: could not connect to ') + options.url);
          reject(err);
        });
      } catch (error) {
        const err = new Error(i18n.__('Error: could not connect to ') + options.url);
        reject(err);
      }
    });
  }
}

module.exports = Controller;
