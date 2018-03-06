/**
 * Resource Index View
 *
 * @copyright (c) 2018 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */

"use strict";
var AppView = require('../appView.js');

class ResourceIndexView extends AppView {

  constructor (data) {
    super();
    this.data = [];

    var max = data.body.length;
    var i = 0;
    var r;

    for (;i<max;i++) {
      r = data.body[i];
      this.data[i] = {
        'Name': r.Resource.name,
        'Username': r.Resource.username,
        'URI': r.Resource.uri,
        'Modified': r.Resource.modified,
        'UUID': r.Resource.id
      };
    }
  }

  render() {
    if(this.data.length === 0) {
      console.log('No resources to display. Create one first!');
    } else {
      console.log(this.columnify(this.data, {
        minWidth: 20,
        config: {
          'username' : {maxWidth: 64}
        }
      }));
    }
  }
}
module.exports = ResourceIndexView;