const fs = require('fs');
const estraverse = require('estraverse');

function toTerm(tree) {
    let term = '';
    tree = estraverse.traverse(tree, {
      enter: function(node, _) {
          term += `${node.type}`;
          if (node.type === 'word') {
              term +=`{${node.name}}`;
          } else if (node.type === 'value') {
              term +=`{${node.value}}`;
          } else {
            term += "("
          }
          return node;
      },
      leave: function(node) { 
          if (node.type === 'apply' || node.type === 'property')
            term +=")"; 
          return node;
    },
      keys: {
        apply: ["operator", "args"],
        property: ["operator","args"],
        word: [],
        value: [],
        regex: []
      },
      fallback: "iteration"
    });

    return term;
  }

  const fileName = process.argv[2] || 'examples/number.json';
  let ast = JSON.parse(fs.readFileSync(fileName, 'utf8'));

  let t = toTerm(ast);
  //let s = JSON.stringify(t, null, 2);
  //console.log(s);
  console.log(t);