var conar = require('../index');

exports.basicTest = {
  setUp: function(done) {
    return done();
  },
  "library load": function(test) {
    test.expect(1);
    test.doesNotThrow(require('../index'));
    test.done();
  },
  "vanilla optimist": function(test) {
    test.expect(2);
    test.equals(conar(['--key','value']).argv.key,'value'); //parse some arguments
    test.equals(conar.default('key',true).argv.key,true); //note that optimist has a single value default method for setting defaults
    test.done();
  },
  "defaults": function(test) {
    test.expect(1);
    test.deepEquals(conar.defaults({defs:{key:value,cat:true,dog:false,number:2}}).argv.defs,{key:value,cat:true,dog:false,number:2}); //defaults takes an object
    test.done();
  },
  "disable": function(test) {
    test.expect(2);
    test.deepEquals(conar(['--key','value','--pie=1']).disable("key").argv,{pie:1}); //disable key
    test.deepEquals(conar(['--secret=hey','--hack','enabled','--bad=true','--good=ok']).disable("bad","hack","secret").argv,{good:"ok"}) //disable multiple
  }
};
