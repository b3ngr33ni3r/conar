var assert = require('assert');
var conar = require('../index');
var flags = require('../flags');

describe("conar", function() {

  it("should have flag values", function() {
    assert.equal(conar.arg, flags.arg, "arg flags didn't match");
    assert.equal(conar.env, flags.env, "env flags didn't match");
    assert.equal(conar.config, flags.config, "config flags didn't match");
  });

  it("should be a function", function() {
    assert.equal(typeof(conar), "function", "conar should be a function");
  });

  it("should return a Conar instance", function() {
    var c = conar();

    assert.equal(typeof(c.parse), "function", "parse should be a function");
    assert.equal(typeof(c.order), "function", "order should be a function");
    assert.equal(typeof(c.opts), "function", "opts should be a function");
    assert.equal(typeof(c.suppress), "function", "suppress should be a function");
    assert.equal(typeof(c.config), "function", "config should be a function");
    assert.equal(typeof(c.env), "function", "env should be a function");
    assert.equal(typeof(c.arg), "function", "arg should be a function");
    assert.equal(typeof(c.defaults), "function", "defaults should be a function");
  });
});

describe("Conar instance", function() {

  it("should parse argv arguments", function() {
    var c = conar({arg:["--hi=there"]})
      .config(false)
      .env(false)
      .opts();

    assert.deepEqual(c, {hi: "there"}, "c shouldn't be "+JSON.stringify(c));
  });

  it("shouldn't parse blacklisted argv arguments", function() {
    var c = conar({arg:["--hi=there"]})
      .config(false)
      .env(false)
      .arg("hi")
      .opts();

    assert.deepEqual(c, {}, "c shouldn't be "+JSON.stringify(c));
  });

  it("shouldn't parse argv if source is disabled", function() {
    var c = conar({arg:["--hi=there"]})
      .arg(false)
      .opts();

    assert.deepEqual(c, {}, "c shouldn't be "+JSON.stringify(c));
  });

  it("should parse whitelisted env arguments", function() {
    var c = conar({env:{hi: "there"}})
      .config(false)
      .arg(false)
      .env("hi")
      .opts();

    assert.deepEqual(c, {hi: "there"}, "c shouldn't be "+JSON.stringify(c));
  });

  it("shouldn't parse all env arguments", function() {
    var c = conar({env:{hi: "there"}})
      .config(false)
      .arg(false)
      .opts();

    assert.deepEqual(c, {}, "c shouldn't be "+JSON.stringify(c));
  });

  it("shouldn't parse env if source is disabled", function() {
    var c = conar({env:{hi: "there"}})
      .env(false)
      .env("hi")
      .opts();

    assert.deepEqual(c, {}, "c shouldn't be "+JSON.stringify(c));
  });

  it("should parse all config files given dir", function() {
    var c = conar()
      .env(false)
      .arg(false)
      .parse("./test")
      .opts();

    assert.deepEqual(c, {
      "application": {
        "production": {
          "port": 3000,
          "debug": false
        },
        "development": {
          "port": 2000,
          "debug": true,
          "pie": true
        }
      }
    }, "c shouldn't be "+JSON.stringify(c));
  });

  it("should parse config files given dir and regex", function() {
    var c = conar()
      .env(false)
      .arg(false)
      .parse("./test", /.?\.json$/)
      .opts();

    assert.deepEqual(c, {
      "application": {
        "production": {
          "port": 3000,
          "debug": false
        },
        "development": {
          "port": 2000,
          "debug": true
        }
      }
    }, "c shouldn't be "+JSON.stringify(c));
  });

  it("should parse config files (using lconf)", function() {
    var c = conar()
      .env(false)
      .arg(false)
      .parse("./test/config.json")
      .opts();

    assert.deepEqual(c, {
      "application": {
        "production": {
          "port": 3000,
          "debug": false
        },
        "development": {
          "port": 2000,
          "debug": true
        }
      }
    }, "c shouldn't be "+JSON.stringify(c));
  });

  it("shouldn't parse blacklisted values from config files (using lconf)", function() {
    var c = conar()
      .env(false)
      .arg(false)
      .parse("./test/config.json")
      .config("application.production.port")
      .opts();

    assert.deepEqual(c, {
      "application": {
        "production": {
          "debug": false
        },
        "development": {
          "port": 2000,
          "debug": true
        }
      }
    }, "c shouldn't be "+JSON.stringify(c));
  });

  it("shouldn't parse config files if source is disabled", function() {
    var c = conar()
      .config(false)
      .parse("./test/config.json")
      .config("application.production.port")
      .opts();

    assert.deepEqual(c, {}, "c shouldn't be "+JSON.stringify(c));
  });

  it("should override env with argv by default", function() {
    var c = conar({env:{hi: "there"}, arg:["--hi=dude"]})
      .config(false)
      .env("hi")
      .opts();

    assert.deepEqual(c, {hi: "dude"}, "c shouldn't be "+JSON.stringify(c));
  });

  it("should override argv with env when told to", function() {
    var c = conar({env:{hi: "there"}, arg:["--hi=dude"]})
      .config(false)
      .env("hi")
      .order(conar.config,conar.arg,conar.env)
      .opts();

    assert.deepEqual(c, {hi: "there"}, "c shouldn't be "+JSON.stringify(c));
  });

  it("should parse from all three sources", function() {
    var c = conar({env:{hi: "there"},arg:["--hey=man"]})
      .env("hi")
      .parse("./test/config.json")
      .opts();

    assert.deepEqual(c, {
      "hi": "there",
      "hey": "man",
      "application": {
        "production": {
          "port": 3000,
          "debug": false
        },
        "development": {
          "port": 2000,
          "debug": true
        }
      }
    }, "c shouldn't be "+JSON.stringify(c));
  });

  it("should override arg->env->config (arg on top)", function() {
    var c = conar({env:{hi: "there"},arg:["--hi=man","--application.production.port=1337"]})
      .env("hi")
      .parse("./test/config.json")
      .opts();

    assert.deepEqual(c, {
      "hi": "man",
      "application": {
        "production": {
          "port": 1337,
          "debug": false
        },
        "development": {
          "port": 2000,
          "debug": true
        }
      }
    }, "c shouldn't be "+JSON.stringify(c));
  });

  it("should suppress exceptions when told to", function() {
    var c = conar()
      .parse("nonexistent")
      .suppress()
      .opts();

      assert.deepEqual(c, {}, "c shouldn't be "+JSON.stringify(c));
  });

  it("should support defaults", function() {
    var c = conar()
      .defaults({hi: "there"})
      .opts();

      assert.deepEqual(c, {hi: "there"}, "c shouldn't be "+JSON.stringify(c));
  });

  it("should override arg->env->config->defaults (arg on top)", function() {
    var c = conar({env:{hi: "there"},arg:["--hi=man","--application.production.port=1337"]})
      .env("hi")
      .parse("./test/config.json")
      .defaults({hi: "pie"})
      .opts();

    assert.deepEqual(c, {
      "hi": "man",
      "application": {
        "production": {
          "port": 1337,
          "debug": false
        },
        "development": {
          "port": 2000,
          "debug": true
        }
      }
    }, "c shouldn't be "+JSON.stringify(c));
  });
});