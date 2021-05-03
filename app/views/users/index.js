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
const AppView = require('../appView.js');

/**
 * User Index View
 */
class UserIndexView extends AppView {
  constructor(data, columns) {
    super();
    this.data = [];
    this.defaultColumns = ['first-name', 'last-name', 'username', 'fingerprint', 'uuid'];
    if (Array.isArray(columns) && columns.length) {
      this.columns = columns.filter(value => this.defaultColumns.includes(value));
    } else {
      this.columns = this.defaultColumns;
    }

    const max = data.body.length;
    let i = 0;
    let u;

    for (;i < max; i++) {
      u = data.body[i];

      this.data[i] = {
        'first-name': u.profile.first_name,
        'last-name': u.profile.last_name,
        'username': u.username,
        'fingerprint': u.Gpgkey ? u.Gpgkey.fingerprint : '',
        'uuid': u.id,
        'created': u.created,
        'modified': u.modified,
      };
    }
  }

  render() {
    console.log(this.columnify(this.data, {
      minWidth: 20,
      columns: this.columns,
      config: {
        'username': {maxWidth: 64}
      }
    }));
  }
}
module.exports = UserIndexView;
