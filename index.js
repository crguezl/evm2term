#!/usr/bin/env node
const fs = require("fs");
const estraverse = require("estraverse");

// Consts describing Egg ASTs
const TYPE = "type";  
const InnerNodes = ["apply", "property"];
const Leaves = {"word": "name", "value": "value"};
const ApplyChildren = {"operator": "op", "args": "args"}; // name of the child: abbreviation
const PropertyChildren = ApplyChildren;
const abbreviation = {
  "operator": "op",
  "args": "args",
};
const KEYS = {
  apply: Object.keys(ApplyChildren),
  property: Object.keys(PropertyChildren),
  word: [],
  value: [],
};

function findMyName(node, parent) {
  let type = node[TYPE];
  let attrName = Leaves[type]; 
  let parentType = parent[TYPE];

  console.log(`processing "${type}(${attrName}:${node[attrName]})" parent: ${parentType}`);
  let name = '';
  let closeBracket = '';
  KEYS[parentType].forEach(childName => {
    if (parent[childName] === node) {
      //console.log(`${childName} is my name`);
      name = `${abbreviation[childName]}:`;
    } else if (Array.isArray(parent[childName])) {
      parent[childName].forEach((child,i) => {
        if (child === node) {
          //console.log(`I am the child ${i} of child ${childName} of ${parentType}`);
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
  return `${name}${type}{${JSON.stringify(node[attrName], null, 0)}}${closeBracket}`;
}

function toTerm(tree) {
  let stack = [];
  let stackPtr = stack;
  tree = estraverse.traverse(tree, {
    enter: function (node, parent) {
      stackPtr = stack.length ? stack[stack.length - 1] : stack;
      let type = node[TYPE];
      if (Object.keys(Leaves).includes(type)) {
        let attrName = Leaves[type]; 
        // find my name as a child of my parent
        //console.log(`processing "${type}(${attrName}:${node[attrName]})" parent: ${parent[TYPE]}`);
        stackPtr.push(findMyName(node, parent));
      } else {
        stack.push([]);
      }
    },
    leave: function (node) {
      if (InnerNodes.includes(node[TYPE])) {
        stackPtr = stack.length ? stack[stack.length - 1] : stack;

        let children = `${stackPtr}`;
        //let children = `op:${stackPtr[0]}, args:[${stackPtr.slice(1)}]`;
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
