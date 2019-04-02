/**
 * Secret View
 *
 * @copyright (c) 2019 Passbolt SA
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */


const AppView = require('../appView.js');

class UserGetView extends AppView {
  constructor(data) {
    super();
    this.data = [];

    this.user = data.body;

    this.data[0] = {
      'first name': this.user.Profile.first_name,
      'last name': this.user.Profile.last_name,
      'username': this.user.User.username,
      'fingerprint': this.user.Gpgkey ? this.user.Gpgkey.fingerprint : '',
      'UUID': this.user.User.id
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
    if (this.user.Gpgkey) {
      console.log(this.user.Gpgkey.armored_key);
    } else {
      console.log('User is not active. No key to display.');
    }
  }
}
module.exports = UserGetView;
