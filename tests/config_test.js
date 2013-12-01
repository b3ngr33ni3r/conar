var conar = require('../index');

exports.configTest = {
  setUp: function(done) {
    return done();
  },
  "json config": function(test) {
    test.expect(2);
    test.equals(conar(['--config','config.json']).argv.application.production.debug,false);
    test.equals(conar.argv.application.development.debug,true);
    test.done();
  },
  "yaml config": function(test) {
    test.expect(1);
    test.equals(conar(['--config','config.yaml']).argv.application.production.debug,false);
    test.done();
  }
};
