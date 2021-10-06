module.exports = function ({ types: t }) {
  function isLeftSideOfAssignmentExpression(path) {
    return t.isAssignmentExpression(path.parent) && path.parent.left === path.node
  }
  return {
    name: 'babel-plugin-inline-env',
    visitor: {
      MemberExpression(path, { opts: { include, exclude } = {} }) {
        if (path.get('object').matchesPattern('process.env')) {
          const key = path.toComputedKey()
          if (
            t.isStringLiteral(key) &&
            !isLeftSideOfAssignmentExpression(path) &&
            (!include || include.indexOf(key.value) !== -1) &&
            (!exclude || exclude.indexOf(key.value) === -1)
          ) {
            if (+(process.env.DISH_DEBUG || '0') > 1) {
              console.log('replacing env', key.value, process.env[key.value])
            }
            path.replaceWith(t.valueToNode(process.env[key.value]))
          } else {
            console.log('cant parse env', key)
          }
        }
      },
    },
  }
}
