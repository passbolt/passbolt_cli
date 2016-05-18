/**
 * Base Application View
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

class AppView {
  /**
   * Constructor
   */
  constructor () {
    this.columnify = require('columnify');
    this.flatten = require('flat');
  }
}
module.exports = AppView;