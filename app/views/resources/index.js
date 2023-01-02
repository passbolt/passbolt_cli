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
const yaml = require('js-yaml');

/**
 * Resource Index View
 */
class ResourceIndexView extends AppView {
  constructor(data, output, columns) {
    super();
    this.data = [];
    this.defaultOutput = 'columns';
    this.defaultColumns = ['name', 'username', 'uri', 'modified', 'uuid'];
    if (output == null) {
      this.output = this.defaultOutput;
    } else {
      this.output = output;
    }
    if (Array.isArray(columns) && columns.length) {
      this.columns = columns.filter(value => this.defaultColumns.includes(value));
    } else {
      this.columns = this.defaultColumns;
    }

    const max = data.body.length;
    let i = 0;
    let r;

    for (;i < max; i++) {
      r = data.body[i];
      this.data[i] = {
        'name': r.name,
        'username': r.username,
        'uri': r.uri,
        'created': r.created,
        'modified': r.modified,
        'uuid': r.id
      };
    }
  }

  render() {
    if (this.output === 'json') {
      console.log(JSON.stringify(this.data, null, 2));
    }
    else if (this.output === 'yaml') {
      console.log(yaml.dump(this.data));
    }
    else if (this.output === 'columns') {
      if (this.data.length === 0) {
        console.log('No resources to display. Create one first!');
      }
      else {
        console.log(this.columnify(this.data, {
          minWidth: 20,
          columns: this.columns,
          config: {
            'username': {maxWidth: 64}
          }
        }));
      }
    }
    else {
      console.log('Output format is unknown.');
    }
  }
}
module.exports = ResourceIndexView;
