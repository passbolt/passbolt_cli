/**
 * User Index View
 *
 * @copyright (c) 2019 Passbolt SA
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */


const AppView = require('../appView.js');

class UserIndexView extends AppView {
  constructor(data, columns) {
    super();
    this.data = [];
    this.columns = ['first-name', 'last-name', 'username', 'fingerprint', 'uuid'];
    if (Array.isArray(columns) && columns.length) {
      this.columns = columns;
    }

    const max = data.body.length;
    let i = 0;
    let u;

    for (;i < max; i++) {
      u = data.body[i];

      this.data[i] = {
        'first-name': u.Profile.first_name,
        'last-name': u.Profile.last_name,
        'username': u.User.username,
        'fingerprint': u.Gpgkey ? u.Gpgkey.fingerprint : '',
        'uuid': u.User.id,
        'created': u.User.created,
        'modified': u.User.modified,
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
