#!/usr/bin/env node
const fs = require("fs");
const estraverse = require("estraverse");

// Consts describing Egg ASTs
const TYPE = "type";  
const InnerNodes = ["apply", "property"];
const Leaves = {"word": "name", "value": "value"};
const ApplyChildren = ["operator", "args"];
const PropertyChildren = ApplyChildren;
const KEYS = {
  apply: ApplyChildren,
  property: PropertyChildren,
  word: [],
  value: [],
};

function toTerm(tree) {
  let stack = [];
  let stackPtr = stack;
  tree = estraverse.traverse(tree, {
    enter: function (node, _) {
      stackPtr = stack.length ? stack[stack.length - 1] : stack;
      let type = node[TYPE];
      let attrName = Leaves[type];
      if (Object.keys(Leaves).includes(type)) {
        stackPtr.push(`${type}{${node[attrName]}}`);
      } else {
        stack.push([]);
      }
    },
    leave: function (node) {
      if (InnerNodes.includes(node[TYPE])) {
        stackPtr = stack.length ? stack[stack.length - 1] : stack;

        let children = `op:${stackPtr[0]}, args:[${stackPtr.slice(1)}]`;
        stack.pop();
        stackPtr = stack.length ? stack[stack.length - 1] : stack;
        stackPtr.push(`${node[TYPE]}(${children})`);
      }
    },
    keys: KEYS,
    fallback: "iteration",
  });

  return stack;
}

const fileName = process.argv[2] || "examples/number.json";
let ast = JSON.parse(fs.readFileSync(fileName, "utf8"));

let t = toTerm(ast);
console.log(t[0]);
