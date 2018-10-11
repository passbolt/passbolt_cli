/**
 * Authentication Controller
 *
 * @copyright (c) 2018 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
const i18n = require('../models/i18n.js');
const GpgAuthController = require('./gpgAuthController.js');
const validate = require('validator');

class AppController extends GpgAuthController {
  /**
   * Constructor
   * @param program
   * @param argv
   */
  constructor(program) {
    super(program);
    this.URL_BASE = `${this.domain.url}/${this.getName()}`;
  }

  /**
   * App controllers should not be instanciated without a name
   */
  getName() {
    throw new Error(i18n.__('Error: no controller name set'));
  }

  /**
   * Index Action - Find and filter
   * @returns {Promise.<T>}
   */
  index() {
    const url = `${this.URL_BASE}.json?api-version=v1`;
    const request  = {
      url,
      jar: this.cookieJar
    };
    return this.get(request)
    .then(response => this.__handleServerResponse(response))
    .catch(err => {
      this.error(err);
    });
  }

  /**
   * View Action
   * @param id
   * @param options
   * @returns {Promise<any>}
   */
  view(id, options) {
    // Check if this is a valid UUID
    if (!validate.isUUID(id)) {
      this.error(i18n.__(`This is not a valid UUID: ${id}`));
    }

    // Get the record
    let url = `${this.URL_BASE}/${id}.json?api-version=v1&`;
    if (typeof options !== 'undefined') {
      url += options;
    }
    const request = {
      url,
      jar: this.cookieJar
    };

    return this.get(request)
    .then(response => this.__handleServerResponse(response))
    .catch(err => {
      this.error(err);
    });
  }

  /**
   * Server response handler
   * @param response
   * @returns {*}
   * @private
   */
  __handleServerResponse(response) {
    let result;
    try {
      result = JSON.parse(response.body);
    } catch (syntaxError) {
      this.log(response.body, 'verbose');
      this.error(`${i18n.__('Error')} ${response.statusCode} ${i18n.__('could not parse server response.')}`);
      return;
    }
    if (response.statusCode === 200 && result.header.url.startsWith('/mfa')) {
      this.error(`${i18n.__('Error')} ${response.statusCode} ${i18n.__('MFA required.')}`);
      return;
    }
    return result;
  }
}

module.exports = AppController;
