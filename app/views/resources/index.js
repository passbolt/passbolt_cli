/**
 * Resource Index View
 *
 * @copyright (c) 2019 Passbolt SA
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */


const AppView = require('../appView.js');

class ResourceIndexView extends AppView {
  constructor(data, columns) {
    super();
    this.data = [];

    this.columns = ['name', 'username', 'uri', 'modified', 'uuid'];
    if (Array.isArray(columns) && columns.length) {
      this.columns = columns;
    }

    const max = data.body.length;
    let i = 0;
    let r;

    for (;i < max; i++) {
      r = data.body[i];
      this.data[i] = {
        'name': r.Resource.name,
        'username': r.Resource.username,
        'uri': r.Resource.uri,
        'created': r.Resource.created,
        'modified': r.Resource.modified,
        'uuid': r.Resource.id
      };
    }
  }

  render() {
    if (this.data.length === 0) {
      console.log('No resources to display. Create one first!');
    } else {
      console.log(this.columnify(this.data, {
        minWidth: 20,
        columns: this.columns,
        config: {
          'username': {maxWidth: 64}
        }
      }));
    }
  }
}
module.exports = ResourceIndexView;
