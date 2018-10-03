/**
 * Resource Index View
 *
 * @copyright (c) 2018 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */

"use strict";
var AppView = require('../appView.js');

class ResourceIndexView extends AppView {

  constructor (data, filter = '', uuidOnly = false) {
    super();
    this.uuidOnly = uuidOnly;
    this.data = data
      .body
      .filter(function(r) {
        return r.Resource.name.toLowerCase().indexOf(filter) >= 0 ||
          r.Resource.uri.toLowerCase().indexOf(filter) >= 0;
      })
      .map(function(r) {
        return {
          'Name': r.Resource.name,
          'Username': r.Resource.username,
          'URI': r.Resource.uri,
          'Modified': r.Resource.modified,
          'UUID': r.Resource.id
        }
      });
  }

  render() {
    if(this.data.length === 0) {
      console.log('No resources to display. Create one first!');
    } else {
      const columnOptions = this.uuidOnly ? {
        columns: ['UUID'],
        showHeaders: false,
      } : {
        minWidth: 20,
        config: {
          'username' : {maxWidth: 64}
        }
      };
      console.log(this.columnify(this.data, columnOptions));
    }
  }
}
module.exports = ResourceIndexView;