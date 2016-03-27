/**
 * i18n Singleton
 *
 * @copyright (c) 2016-onwards Bolt Softwares pvt. ltd.
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var y18n = require('y18n');
// todo get i18n user pref
var i18n = new y18n({
  directory : './app/locales',
  updateFiles : false
});
module.exports = i18n;