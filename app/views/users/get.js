/**
 * Secret View
 *
 * @copyright (c) 2018 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */

"use strict";
var AppView = require('../appView.js');

class UserGetView extends AppView {

  constructor (data) {
    super();
    this.data = [];
    var u;

    u = data.body;

    this.data[0] = {
      'first name': u.Profile.first_name,
      'last name': u.Profile.last_name,
      'username': u.User.username,
      'fingerprint': u.Gpgkey.fingerprint,
      'UUID': u.User.id
    };
  }

  render() {
    console.log(this.columnify(this.data, {
      minWidth: 20,
      columns: ['first name', 'last name', 'username', 'fingerprint', 'UUID'],
      config: {
        'username' : {maxWidth: 64}
      }
    }));
  }
}
module.exports = UserGetView;