var {run}  = require('../lib/eggvm.js');

// Examples
run(`do(define(x, 4),
       define(setx, fun(val, set(x, val))),
       setx(50),
       print(x))`);
