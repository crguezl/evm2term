
> evm2term@1.1.3 complex
> ./index.js examples/calc.json

apply(
  op:word{"do"},
  args:[
    apply(
    op:word{"def"},
    args:[
    word{"h"},
    apply(
      op:word{"fun"},
      args:[
      word{"x"},
      apply(
        op:apply(
          op:word{"mul"},
          args:[
          word{"x"}]),
        args:[
        value{{"type":"Complex","info":[{"re":1,"im":1}]}}])])]),
  apply(
    op:word{"do"},
    args:[
      apply(
      op:word{"print"},
      args:[
        apply(
        op:word{"def"},
        args:[
        word{"c"},
        apply(
          op:word{"h"},
          args:[
          value{{"type":"Complex","info":[{"re":3,"im":2}]}}])])]),
    apply(
      op:word{"print"},
      args:[
        apply(
        op:apply(
          op:word{"add"},
          args:[
          word{"c"}]),
        args:[
        value{{"type":"Complex","info":[{"re":1,"im":-1}]}}])])])])
