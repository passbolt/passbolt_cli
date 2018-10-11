/**
 * Copyright (c) 2007--2016 Kevin van Zonneveld (http://kvz.io)
 * and Contributors (http://phpjs.org/authors)
 * @license MIT license
 */
exports.stripslashes = function stripslashes(str) {
  // @credit: http://phpjs.org/functions/stripslashes/
  return (`${str}`)
  .replace(/\\(.?)/g, (s, n1) => {
    switch (n1) {
      case '\\':
        return '\\';
      case '0':
        return '\u0000';
      case '':
        return '';
      default:
        return n1;
    }
  });
};

exports.urldecode = function(str) {
  // @credit: http://phpjs.org/functions/urldecode/
  return decodeURIComponent((`${str}`)
  .replace(/%(?![\da-f]{2})/gi, () =>
  // PHP tolerates poorly formed escape sequences
    '%25'
  )
  .replace(/\+/g, '%20'));
};
