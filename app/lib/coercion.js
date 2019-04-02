// Coercion for application
let Coercion = {};
Coercion.list = function (val) {
  return val.split(',');
};

module.exports = Coercion;
