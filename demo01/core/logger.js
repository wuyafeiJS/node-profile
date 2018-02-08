const tracer = require('tracer');
const config = require('../config');

console.log("config log level: ", config.level);

const __logger = tracer.colorConsole({
  level: config.level,
  format: '{{timestamp}} <{{title}}> {{file}}(#{{line}}): {{message}}'
});

const logger = {};

const REG = {
  WHITE: /(\r?\n)+\s*/g,
  PWD_1: /((?:password|pwd)\w*=)([^&$]+)/ig,
  PWD_2: /((?:password|pwd)\w*":")([^"]+)(")/ig,
};

for (let name in __logger) {
  logger[name] = function() {
    let args = [];
    [].slice.apply(arguments).forEach(val => {
      if (typeof val === 'string') {
        val = val
          .replace(REG.WHITE, ' ')
          .replace(REG.PWD_1, '$1******')
          .replace(REG.PWD_2, '$1******$3');
      }
      args.push(val);
    });
    __logger[name](...args);
  }
}


module.exports = logger;
