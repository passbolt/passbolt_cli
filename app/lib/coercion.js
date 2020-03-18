// Coercion for application
const Coercion = {};
Coercion.list = function(val) {
  return val.split(',');
};

module.exports = Coercion;
