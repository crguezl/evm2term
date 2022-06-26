#!/usr/bin/env node
const fs = require("fs");
const evm2term = require("../index");
const { program } = require('commander');
const { version } = require('../package.json');
program
.name('evm2term')
  .version(version)
  .option('-i, --indent');

program.parse();

const options = program.opts();

const fileName = program.args.shift() || "examples/number.json";
let ast = JSON.parse(fs.readFileSync(fileName, "utf8"));

let t = evm2term(ast, options);
console.log(t[0]);
