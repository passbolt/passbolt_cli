/**
 * Resource Index View
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */

"use strict";
var View = require('../view.js');

class UserIndexView extends View {

  constructor (data) {
    super();
    this.data = [];
    var max = data.body.length;
    var i = 0;
    var u;

    for (;i<max;i++) {
      u = data.body[i];

      this.data[i] = {
        'UUID': u.Resource.id,
        'Name': u.Resource.name,
        'URI': u.Resource.uri,
        'Modified': u.Resource.modified
      };
    }
  }

  render() {
    console.log(this.columnify(this.data, {
      minWidth: 20,
      config: {
        'username' : {maxWidth: 64}
      }
    }));
  }
}
module.exports = UserIndexView;