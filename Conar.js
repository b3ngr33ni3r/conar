var minimist = require('minimist');
var lconf = require('lconf');
var hulksmash = require('hulksmash');
require('array.prototype.find');

var flags = require('./flags');

module.exports = function(opts) {
  var self = this;

  // internal state for sources
  self._sources = {
    arg: {
      enabled: true,
      blacklist: [],
      opts: opts && opts.arg ? opts.arg : process.argv.slice(2)
    },
    env: {
      enabled: true,
      whitelist: [],
      opts: opts && opts.env ? opts.env : process.env
    },
    config: {
      enabled: true,
      blacklist: []
    },
    _: {
      logger: function(){},
      defaults: {},
      suppress: false,
      order: {
        first: flags.config,
        second: flags.env,
        third: flags.arg
      }
    }
  };

  self.defaults = function(obj) {
    self._sources._.defaults = hulksmash.objects(self._sources._.defaults, obj);
    return self;
  };

  self.arg = function(key) {
    if (key === false) {
      self._sources.arg.enabled = false;
    }

    self._sources.arg.blacklist.push(key);

    return self;
  };

  self.env = function(key) {
    if (key === false) {
      self._sources.env.enabled = false;
    }

    self._sources.env.whitelist.push(key);

    return self;
  };

  self.config = function(key, allow) {
    if (key === false) {
      self._sources.config.enabled = false;
    }

    if (allow === false) {
      self._sources.config.blacklist.push(key);
    }

    return self;
  };

  self.order = function(first, second, third) {
    if ((first != flags.config && first != flags.arg && first != flags.env) ||
        (second != flags.config && second != flags.arg && second != flags.env) ||
        (third != flags.config && third != flags.arg && third != flags.env)) {
      throw new Error("invalid parameter. order must be passed a flag value from conar.<env_type> param");
    }

    self._sources._.order.first = first;
    self._sources._.order.second = second;
    self._sources._.order.third = third;

    return self;
  };

  // pass through and lazy initializer for self._lconf instance's parse
  self.parse = function() {
    if (!self._lconf) {
      self._lconf = lconf();
    }

    self._lconf.parse.apply(self._lconf, arguments);

    return self;
  };

  // set/toggle the suppression flag
  self.suppress = function(bool) {
    self._sources._.suppress = bool || true;

    return self;
  };

  // pulled out parse logic functions, as ordering changes in .opts()
  
  function parseConfig() {
    var res = {};
    if (self._sources.config.enabled && self._lconf) {
      self._sources._.logger("config:enabled");
      var b = self._lconf.opts();
      self._sources._.logger(b);
      res = hulksmash.keys(b);
      //self._sources._.logger(res);
      
      var nuke = self._sources.config.blacklist.find(function(e) { return res.hasOwnProperty(e); });

      self._sources._.logger(nuke);

      // remove any blacklists from config before returning
      if (typeof(nuke) === "string") {
        delete res[nuke];
      } else if (nuke) {
        for (var i = 0 ; i < nuke.length ; i ++) {
          delete res[nuke[i]];
        }
      }
    }
    return res;
  }

  function parseEnv() {
    var res = {};
    if (self._sources.env.enabled) {
      self._sources._.logger(self._sources.env.opts); 

      // if we have nothing whitelisted, return
      if (typeof(self._sources.env.whitelist) !== "undefined") {
        for (var i = 0; i < self._sources.env.whitelist.length ; i++) {
          if (self._sources.env.opts.hasOwnProperty(self._sources.env.whitelist[i])) {
            res[self._sources.env.whitelist[i]] = self._sources.env.opts[self._sources.env.whitelist[i]];
          }
        }
      
        self._sources._.logger(res); 
      }
    }
    return res;
  }

  function parseArg() {
    var res = {};
    if (self._sources.arg.enabled) {
      self._sources._.logger(self._sources.arg.opts); 

      res = minimist(self._sources.arg.opts);
      delete res["_"]; // we don't support danglers currently

      self._sources._.logger(res);

      var nuke = (self._sources.arg.blacklist) ? self._sources.arg.blacklist.find(function(e) { return res.hasOwnProperty(e); }) : [];

      self._sources._.logger("nuke: "+nuke);

      // remove any blacklists from arg before returning
      if (typeof(nuke) === "string") {
        delete res[nuke];
      } else if (nuke) {
        for (var i = 0 ; i < nuke.length ; i ++) {
          delete res[nuke[i]];
        }
      }
    }
    return res;
  }

  // does the actual parsing/work and returns the resultant
  self.opts = function() {
    var res = {}, except = [];

    try{
      self._sources._.logger("trying to parse: pass0");

      if (self._sources._.order.first === flags.config) {
        res = parseConfig();
      } else if (self._sources._.order.first === flags.env) {
        res = parseEnv();
      } else if (self._sources._.order.first === flags.arg) {
        res = parseArg();
      }

      self._sources._.logger("trying to parse: pass1");   

      if (self._sources._.order.second === flags.config) {
        res = hulksmash.objects(res, parseConfig());
      } else if (self._sources._.order.second === flags.env) {
        res = hulksmash.objects(res, parseEnv());
      } else if (self._sources._.order.second === flags.arg) {
        res = hulksmash.objects(res, parseArg());
      }

      self._sources._.logger("trying to parse: pass2");

      if (self._sources._.order.third === flags.config) {
        res = hulksmash.objects(res, parseConfig());
      } else if (self._sources._.order.third === flags.env) {
        res = hulksmash.objects(res, parseEnv());
      } else if (self._sources._.order.third === flags.arg) {
        res = hulksmash.objects(res, parseArg());
      }
      
      self._sources._.logger("trying to parse: pass3");

    } catch (e) {

      self._sources._.logger("exception! "+JSON.stringify(e));
      
      except.push(e);
    }

    // Throw if need be
    if (self._sources._.suppress && except.length > 0) {
      throw {error:"aggregate exception", inner: except};
    }

    return res;
  };

  self.log = function(logger) {
    self._sources._.logger = logger;

    return self;
  };
};