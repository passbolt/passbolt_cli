/**
 * Resource Controller
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var GpgAuthController = require('./gpgAuthController.js');

class ResourceController extends GpgAuthController {

  /**
   * Constructor
   */
  constructor (program, argv) {
    super(program, argv);
    var baseUrl = this.domain.url + '/resources';
    this.URL_INDEX = baseUrl + '.json';
  }

  find() {
    var _this = this;
    _this.log('GET ' + this.URL_INDEX, 'verbose');

    return _this.get({
        url: this.URL_INDEX,
        jar: _this.cookieJar
      })
      .then(function(response) {
        _this.log(response.statusCode, 'verbose');
        if(response.statusCode === 200) {
          return JSON.parse(response.body);
        }
        //_this.error(response.body.header.message);
      })
      .catch(function(err) {
        _this.error(err);
      });
  }
}

module.exports = ResourceController;