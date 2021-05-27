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
const fs = require('fs');
const os = require('os');
const _path = require('path');

/**
 * Config model
 */
class Config {
  /**
   * Get a config for a given file path
   * @param path
   * @returns {*}
   */
  static get(file, path) {
    if (path === undefined) {
      path = _path.dirname(require.main.filename);
    }

    if (file === undefined) {
      const home = os.homedir();

      if (fs.existsSync(home + '/.config/passbolt/config.json')) {
        file = home + '/.config/passbolt/config.json';
      } else {
        file = path + '/app/config/config.json'
      }
    }

    if (!fs.existsSync(file)) {
      return Error(`Config file not found! [${file}]`);
    }

    try {
      const data = fs.readFileSync(file, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return Error(`Something is wrong with the config file! [${file}]`);
    }
  }
}

module.exports = Config;
