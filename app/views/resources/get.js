/**
 * Secret View
 *
 * @copyright (c) 2019 Passbolt SA
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */


const AppView = require('../appView.js');

class GetView extends AppView {
  constructor(data) {
    super();
    this.data = data;
  }

  render() {
    console.log(this.data.body.Secret[0].data);
  }
}
module.exports = GetView;
