#!/usr/bin/env node
const fs = require("fs");
const estraverse = require("estraverse");

// Consts describing Egg ASTs
const TYPE = "type";  
const InnerNodes = ["apply", "property"];
const Leaves = {"word": "name", "value": "value"};
const ApplyChildren = {"operator": "op", "args": "args"}; // name of the child: abbreviation
const PropertyChildren = ApplyChildren;
const KEYS = {
  apply: Object.keys(ApplyChildren),
  property: Object.keys(PropertyChildren),
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
      if (Object.keys(Leaves).includes(type)) {
        let attrName = Leaves[type]; // word{"+"}
        stackPtr.push(`${type}{${JSON.stringify(node[attrName], null, 0)}}`);
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
