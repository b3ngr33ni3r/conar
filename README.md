Conar
=======

[![devDependency Status](https://david-dm.org/b3ngr33ni3r/conar/dev-status.png)](https://david-dm.org/b3ngr33ni3r/conar#info=devDependencies) [![Dependency Status](https://david-dm.org/b3ngr33ni3r/conar.png)](https://david-dm.org/b3ngr33ni3r/conar) [![Build Status](https://travis-ci.org/b3ngr33ni3r/conar.png?branch=master)](https://travis-ci.org/b3ngr33ni3r/conar)

> This is _sort of_ a replacement for [uniformer](htts://github.com/b3ngr33ni3r/uniformer).
returns a key-value object from combined config file/argv values.

## How?

Conar combines the power and ease of configuration files (_currently yaml and json_) with command line arguments to make launching applications with options simple for both developers, and consumers.

By wrapping [optimist](https://github.com/substack/node-optimist) we get some serious argument-parsing firepower, that we combine with configuration features.

You can [peruse the tests](https://github.com/b3ngr33ni3r/conar/blob/master/tests), [view the latest build](https://travis-ci.org/b3ngr33ni3r/conar.png?branch=master) on travis-ci, or [checkout the examples](https://github.com/b3ngr33ni3r/conar/wiki/Examples) in [the wiki](https://github.com/b3ngr33ni3r/conar/wiki) to learn a bit more.

## Quick Examples


```
var conar = require('conar');
var config = conar.argv; //just like optimist
```

```
var conar = require('conar');
var config = conar.defaults({debug:false,port:3000}).argv;    //setup defaults without doing .default(key,value) for each
```

```
var conar = require('conar');
var config = conar.argv; //pass config=path/to/config at command line to merge config file values with argument values
```

```
var conar = require('conar');
var config = conar.default('config',"path/to/config"); //merge with config at path/to/config by default
```

```
var conar = require('conar');
var config = conar.disable("config").default('config',"path/to/config"); //merge with config (user can't override with config=path) at path/to/config
```

```
var conar = require('conar');
var config = conar.disable("port","secret","id","author"); //disable these keys from being set by the user (API can still set 'em)
```

## More stuff?

The name comes from __CON__figuration + __AR__guments.  
  
The [issue tracker](https://github.com/b3ngr33ni3r/conar/issues) is where you should submit bugs, or read about future plans.  
  
The [license](https://github.com/b3ngr33ni3r/conar/blob/master/LICENSE) is MIT.
