/**
 * Config Model
 *
 * @copyright (c) 2017 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var fs = require('fs');
var _path = require('path');

/**
 * Config model
 */
class Config {

  /**
   * Get a config for a given file path
   * @param path
   * @returns {*}
   */
  static get (file, path) {
    if (file === undefined) {
      file = '/app/config/config.json';
    }
    if(path === undefined) {
      file = _path.dirname(require.main.filename) + file;
    } else {
      file = path + file;
    }
    if(!fs.existsSync(file)) {
      return Error('Config file not found! [' + file + ']');
    }

    try {
      var data = fs.readFileSync(file, 'utf8');
      var obj = JSON.parse(data);
    } catch (e) {
      return Error('Something is wrong with the config file! [' + file + ']');
    }
    return obj;
  }
}

module.exports = Config;
