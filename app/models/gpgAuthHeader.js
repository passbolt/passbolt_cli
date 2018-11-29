/**
 * Gpg Auth Http Header Model
 *
 * @copyright (c) 2018 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
const Model = require('./model.js');
const i18n = require('./i18n.js');

/**
 * The class that deals with GPGAuth Headers.
 */
class GpgAuthHeader extends Model {

  /**
   * Validate the GPGAuth custom HTTP headers of the server response for a given stage
   * @param stage
   * @param headers
   * @throws Error if stage error
   * @returns {boolean}
   */
  static validateByStage(stage, headers) {
    if (typeof headers === 'undefined') {
      throw new Error(i18n.__('No GPGAuth headers set.'));
    }
    if (typeof headers['x-gpgauth-version'] !== 'string' ||
      headers['x-gpgauth-version'] !== '1.3.0') {
      throw new Error(i18n.__(`That version of GPGAuth is not supported. (${headers['x-gpgauth-version']})`));
    }

    switch (stage) {
      case 'logout' :
        if (headers['x-gpgauth-authenticated']) {
          throw new Error(i18n.__('x-gpgauth-authenticated should be set to false during the logout stage'));
        }
        break;
      case 'verify' :
      case 'stage0' :
        if (typeof headers['x-gpgauth-authenticated'] !== 'string' ||
          headers['x-gpgauth-authenticated'] !== 'false') {
          throw new Error(i18n.__('x-gpgauth-authenticated should be set to false during the verify stage'));
        }
        if (typeof headers['x-gpgauth-progress'] !== 'string' ||
          headers['x-gpgauth-progress'] !== 'stage0') {
          throw new Error(i18n.__('x-gpgauth-progress should be set to stage0 during the verify stage'));
        }
        if (typeof headers['x-gpgauth-user-auth-token'] !== 'undefined') {
          throw new Error(i18n.__(`x-gpgauth-user-auth-token should not be set during the verify stage${
            typeof headers['x-gpgauth-user-auth-token']}`));
        }
        if (typeof headers['x-gpgauth-verify-response'] !== 'string') {
          throw new Error(i18n.__('x-gpgauth-verify-response should be set during the verify stage'));
        }
        if (typeof headers['x-gpgauth-refer'] !== 'undefined') {
          throw new Error(i18n.__('x-gpgauth-refer should not be set during verify stage'));
        }
        break;

      case 'stage1' :
        if (typeof headers['x-gpgauth-authenticated'] !== 'string' ||
          headers['x-gpgauth-authenticated'] !== 'false') {
          throw new Error(i18n.__('x-gpgauth-authenticated should be set to false during stage1'));
        }
        if (typeof headers['x-gpgauth-progress'] !== 'string' ||
          headers['x-gpgauth-progress'] !== 'stage1') {
          throw new Error(i18n.__('x-gpgauth-progress should be set to stage1'));
        }
        if (typeof headers['x-gpgauth-user-auth-token'] === 'undefined') {
          throw new Error(i18n.__('x-gpgauth-user-auth-token should be set during stage1'));
        }
        if (typeof headers['x-gpgauth-verify-response'] !== 'undefined') {
          throw new Error(i18n.__('x-gpgauth-verify-response should not be set during stage1'));
        }
        if (typeof headers['x-gpgauth-refer'] !== 'undefined') {
          throw new Error(i18n.__('x-gpgauth-refer should not be set during stage1'));
        }
        return true;

      case 'complete':
        if (typeof headers['x-gpgauth-authenticated'] !== 'string' ||
          headers['x-gpgauth-authenticated'] !== 'true') {
          throw new Error(i18n.__('x-gpgauth-authenticated should be set to true when GPGAuth is complete'));
        }
        if (typeof headers['x-gpgauth-progress'] !== 'string' ||
          headers['x-gpgauth-progress'] !== 'complete') {
          throw new Error(i18n.__('x-gpgauth-progress should be set to complete during final stage'));
        }
        if (typeof headers['x-gpgauth-user-auth-token'] !== 'undefined') {
          throw new Error(i18n.__('x-gpgauth-user-auth-token should not be set during final stage'));
        }
        if (typeof headers['x-gpgauth-verify-response'] !== 'undefined') {
          throw new Error(i18n.__('x-gpgauth-verify-response should not be set during final stage'));
        }
        if (typeof headers['x-gpgauth-refer'] !== 'string') {
          throw new Error(i18n.__('x-gpgauth-refer should be set during final stage'));
        }
        return true;

      default:
        throw new Error(i18n.__('Unknown GPGAuth stage'));
    }
  }
}

module.exports = GpgAuthHeader;
