#!/usr/bin/env node
const fs = require("fs");
const estraverse = require("estraverse");

const TYPE = "type";
const InnerNodes = ["apply", "property"];

function toTerm(tree) {
  let aux = [];
  let lastTree = aux;
  tree = estraverse.traverse(tree, {
    enter: function (node, _) {
      lastTree = aux.length ? aux[aux.length - 1] : aux;
      if (node[TYPE] === "word") {
        lastTree.push(`${node[TYPE]}{${node.name}}`);
      } else if (node[TYPE] === "value") {
        lastTree.push(`${node[TYPE]}{${node.value}}`);
      } else {
        aux.push([]);
      }
    },
    leave: function (node) {
      if (InnerNodes.includes(node[TYPE])) {
        lastTree = aux.length ? aux[aux.length - 1] : aux;

        let children = `op:${lastTree[0]}, args:[${lastTree.slice(1)}]`;
        aux.pop();
        lastTree = aux.length ? aux[aux.length - 1] : aux;
        lastTree.push(`${node[TYPE]}(${children})`);
      }
    },
    keys: {
      apply: ["operator", "args"],
      property: ["operator", "args"],
      word: [],
      value: [],
      regex: [],
    },
    fallback: "iteration",
  });

  return aux;
}

const fileName = process.argv[2] || "examples/number.json";
let ast = JSON.parse(fs.readFileSync(fileName, "utf8"));

let t = toTerm(ast);
console.log(t[0]);
