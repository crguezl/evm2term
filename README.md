
```ruby
➜  evm2term git:(master) cat examples/property.egg
x["sub", 1]("length") # 3
```

```json
➜  evm2term git:(master) ✗ egg-oop-parser-solution/bin/eggc.js examples/property.egg       
➜  evm2term git:(master) ✗ cat examples/property.json 
{
  "type": "apply",
  "operator": {
    "type": "property",
    "operator": {
      "type": "word",
      "line": 1,
      "col": 1,
      "length": 1,
      "name": "x"
    },
    "args": [
      {
        "type": "value",
        "value": "sub",
        "line": 1,
        "col": 3,
        "length": 5,
        "raw": "\"sub\""
      },
      {
        "type": "value",
        "value": 1,
        "line": 1,
        "col": 10,
        "length": 1
      }
    ]
  },
  "args": [
    {
      "type": "value",
      "value": "length",
      "line": 1,
      "col": 13,
      "length": 8,
      "raw": "\"length\""
    }
  ]
}
```

```
➜  evm2term git:(master) ./index.js examples/property.json    
apply(op:property(op:word{x}, args:[value{sub},value{1}]), args:[value{length}])
```