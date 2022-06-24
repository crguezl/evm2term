#!/usr/bin/env node
const fs = require("fs");
const estraverse = require("estraverse");

// Consts describing the ASTs
const {
  KEYS,
  abbreviation,
  InnerNodes,
  Leaves,
  TYPE,
} = require("./egg-ast-description");

function findMyName(node, parent) {
  let parentType = parent? parent[TYPE] : "";

  let name = '';
  let closeBracket = '';
  KEYS[parentType]?.forEach(childName => {
    if (parent[childName] === node) {
      //console.log(`${childName} is my name`);
      name = `${abbreviation[childName]}:`;
    } else if (Array.isArray(parent[childName])) {
      parent[childName].forEach((child,i) => {
        if (child === node) {
          if (i == 0) {
            name = `${childName}:[`;
          }
          if (i == parent[childName].length - 1) {
            closeBracket = ']';
          }
        }
      });
    }
  });
  return {name, closeBracket};
}

function toTerm(tree) {
  let stack = [];
  let stackPtr = () => stack.length ? stack[stack.length - 1] : stack;
  tree = estraverse.traverse(tree, {
    enter: function (node, parent) {
      let type = node[TYPE];
      if (Object.keys(Leaves).includes(type)) {
        let { name, closeBracket } = findMyName(node, parent);
        let attrName = Leaves[type];
        let description = attrName ? `{${JSON.stringify(node[attrName], null, 0)}}` : "";
        stackPtr().push(`${name}${type}${description}${closeBracket}`);
      } else {
        stack.push([]);
      }
    },
    leave: function (node, parent) {
      if (InnerNodes.includes(node[TYPE])) {
        let children = `${stackPtr()}`;
        stack.pop();
      
        let { name, closeBracket } = findMyName(node, parent);
        stackPtr().push(`${name}${node[TYPE]}(${children})${closeBracket}`);
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
