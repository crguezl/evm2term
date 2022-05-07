#!/usr/bin/env node
const fs = require("fs");
const estraverse = require("estraverse");

const TYPE = "type";
const InnerNodes = ["apply", "property"];
const ApplyChildren = ["operator", "args"];
const PropertyChildren = ApplyChildren;

function toTerm(tree) {
  let stack = [];
  let lastTree = stack;
  tree = estraverse.traverse(tree, {
    enter: function (node, _) {
      lastTree = stack.length ? stack[stack.length - 1] : stack;
      if (node[TYPE] === "word") {
        lastTree.push(`${node[TYPE]}{${node.name}}`);
      } else if (node[TYPE] === "value") {
        lastTree.push(`${node[TYPE]}{${node.value}}`);
      } else {
        stack.push([]);
      }
    },
    leave: function (node) {
      if (InnerNodes.includes(node[TYPE])) {
        lastTree = stack.length ? stack[stack.length - 1] : stack;

        let children = `op:${lastTree[0]}, args:[${lastTree.slice(1)}]`;
        stack.pop();
        lastTree = stack.length ? stack[stack.length - 1] : stack;
        lastTree.push(`${node[TYPE]}(${children})`);
      }
    },
    keys: {
      apply: ApplyChildren,
      property: PropertyChildren,
      word: [],
      value: [],
      regex: [],
    },
    fallback: "iteration",
  });

  return stack;
}

const fileName = process.argv[2] || "examples/number.json";
let ast = JSON.parse(fs.readFileSync(fileName, "utf8"));

let t = toTerm(ast);
console.log(t[0]);
