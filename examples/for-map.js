function logMapElements(value, key, map) {
    console.log(`map.get('${key}') = ${value}`)
}
new Map([['foo', 3], ['bar', {}], ['baz', undefined]]).forEach(logMapElements)