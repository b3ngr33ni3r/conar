var Conar = require('./Conar');
var flags = require('./flags');

var exp = function(opts) {
  return new Conar(opts);
};

// Flags for Conar.order()
exp.config = flags.config;
exp.env = flags.env;
exp.arg = flags.arg;

module.exports = exp;