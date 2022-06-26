#!/usr/bin/env node
const fs = require("fs");
const evm2term = require("../index");

const fileName = process.argv[2] || "examples/number.json";
let ast = JSON.parse(fs.readFileSync(fileName, "utf8"));

let t = evm2term(ast);
console.log(t[0]);
