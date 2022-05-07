const fs = require('fs');
const estraverse = require('estraverse');

function toTerm(tree) {
    let aux = [];
    let lastTree = aux;
    tree = estraverse.traverse(tree, {
      enter: function(node, _) {
          lastTree = aux.length? aux[aux.length-1] : aux;
          if (node.type === 'word') {
            lastTree.push(`${node.type}{${node.name}}`);
          } else if (node.type === 'value') {
            lastTree.push(`${node.type}{${node.value}}`);
          } else {
            aux.push([]);
          }
      },
      leave: function(node) { 
          if (node.type === 'apply' || node.type === 'property') {
            let children = aux.join(',');
            aux.pop();
            lastTree = aux.length? aux[aux.length-1] : aux;
            lastTree.push(`${node.type}(${children})`); 
          }
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

    return aux;
  }

  const fileName = process.argv[2] || 'examples/number.json';
  let ast = JSON.parse(fs.readFileSync(fileName, 'utf8'));

  let t = toTerm(ast);
  //let s = JSON.stringify(t, null, 2);
  //console.log(s);
  console.log(t);