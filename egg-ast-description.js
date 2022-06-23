// Consts describing Egg ASTs
const TYPE = "type";  
// Attributes for leaves you want to display
const Leaves = {"word": "name", "value": "value"};
const InnerNodes = ["apply", "property"];

const abbreviation = {
  "operator": "op",
  "args": "args",
};
const ApplyChildren = Object.keys(abbreviation); // name of the child: abbreviation
const PropertyChildren = ApplyChildren;

const KEYS = {
  apply: ApplyChildren,
  property: PropertyChildren,
  word: [],
  value: [],
};

module.exports = {
  KEYS,
  abbreviation,
  InnerNodes,
  Leaves,
  TYPE,
};