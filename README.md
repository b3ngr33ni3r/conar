Conar [![Build Status](https://travis-ci.org/bengreenier/conar.png?branch=master)](https://travis-ci.org/bengreenier/conar)
=======
conar (pronounced like the name connor) provides a quick, customizable way to __combine environment, argument, and configuration file values at runtime into a configuration object__.

# api

conar supports a few different things:
  
  + __(opts:object)__:  
  creates an instance of conar with options. these options are currently only useful for test hooks; it supports:
  ```    
  {
    env:{},  // an environment object to mock out process.env
    arg: [] // an argument object to mock out process.argv
  }
  ```
  
  + __.env:number__:  
  see `order()` method below; provides support for ordering the parsing engine different; represents the env parser

  + __.arg:number__:  
  see `order()` method below; provides support for ordering the parsing engine different; represents the arg parser

  + __.config:number__:  
  see `order()` method below; provides support for ordering the parsing engine different; represents the config parser [bengreenier/lconf](https://github.com/bengreenier/lconf)


once you've created an instance, that instance has the following api methods:

  + __parse(file:string)__:  
  parse a file using [bengreenier/lconf](https://github.com/bengreenier/lconf) for configuration. supports `json`, `yaml`, `yml`, and `js` (with `module.exports = {};`)

  + __order(first:number, second:number, third:number)__:  
  set the order for parsing; takes one of the `.<source>` parameters from off `conar`. parsing happens in the order `first<-second<-third` where `<-` indicates overwrite

  + __defaults(default:object)__:  
  adds default values for certain properties; when parsed, these will be overriden by any active parsers

  + __config(key:string)__:  
  blacklists a key from being parsed by this source

  + __config(bool:boolean)__:  
  prevents this sources parser from being run at all (disables it)

  + __arg(key:string)__:  
  blacklists a key from being parsed by this source

  + __arg(bool:boolean)__:  
  prevents this sources parser from being run at all (disables it)

  + __env(key:string)__:  
  blacklists a key from being parsed by this source

  + __env(bool:boolean)__:  
  prevents this sources parser from being run at all (disables it)

  + __suppress([bool:boolean])__:  
  when set, any exceptions that would normally be thrown by parsers will not be thrown. `bool` is optional, defaults to `true`

  + __opts()__:  
  this call does the actual processing, and __returns an object__.

  + __log(func:function)__:  
  test hook for writing some internal logging info; should be given a function which will be called with one argument. (hint: `console.log`)

all methods can be chained, unless specifically indicated otherwise (like `opts()`).

# examples

```
var conar = require('conar');
var config = conar().opts(); // returns all arguments parsed via command line
```

```
var conar = require('conar');
var config = conar().defaults({port:3000}).opts(); // sets a default value port to 3000
```

```
var conar = require('conar');
var config = conar()
              .env("port") // whitelist port environment variable
              .parse("config.json") // parse some config file
              .defaults({port: 1337}) // set a default port
              .opts(); // do the work, get an object
```

```
var conar = require('conar');
var config = conar()
              .env("port") // whitelist port environment variable
              .env("prod") // whitelist prod environment variable
              .arg("prod") // blacklist prod argument (can't be set like --prod)
              .config(false) // disable config parsing altogether
              .defaults({port: 1337}) // set a default port value to 1337
              .opts(); // do the work, get an object
```

hopefully you get the idea.