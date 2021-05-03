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

class UserGetView extends AppView {
  constructor(data) {
    super();
    this.data = [];
    this.user = data.body;
    this.data[0] = {
      'first name': this.user.profile.first_name,
      'last name': this.user.profile.last_name,
      'username': this.user.username,
      'fingerprint': this.user.gpgkey ? this.user.gpgkey.fingerprint : '',
      'UUID': this.user.id
    };
  }

  render() {
    console.log(this.columnify(this.data, {
      minWidth: 20,
      columns: ['first name', 'last name', 'username', 'fingerprint', 'UUID'],
      config: {
        'username': {maxWidth: 64}
      }
    }));
    console.log('');
    if (this.user.gpgkey) {
      console.log(this.user.gpgkey.armored_key);
    } else {
      console.log('User is not active. No key to display.');
    }
  }
}
module.exports = UserGetView;
