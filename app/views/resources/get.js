/**
 * Secret View
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */

"use strict";
var AppView = require('../appView.js');

class GetView extends AppView {

  constructor (data) {
    super();
    this.data = data;
  }

  render() {
    console.log(this.data.body.Secret[0].data);
  }
}
module.exports = GetView;