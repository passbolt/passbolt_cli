/**
 * Authentication Controller
 *
 * @copyright (c) 2019 Passbolt SA
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
const i18n = require('../models/i18n.js');
const GpgAuthController = require('./gpgAuthController.js');
const validate = require('validator');

class AppController extends GpgAuthController {
  /**
   * Constructor
   * @param program
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
   * @returns {Promise<*>}
   */
  async index() {
    const url = `${this.URL_BASE}.json?api-version=v1`;
    const request  = {
      url,
      jar: this.cookieJar
    };
    const response = await this.get(request);
    try {
      return this._parseResponse(response);
    } catch (error) {
      this.error(error);
    }
  }

  /**
   * View Action
   * @param id
   * @param options
   * @returns {Promise<*>}
   */
  async view(id, options) {
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

    try {
      const response = await this.get(request);
      return this._parseResponse(response);
    } catch (error) {
      this.error(error);
    }
  }
}

module.exports = AppController;
