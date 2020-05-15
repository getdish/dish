let uid = 0

module.exports = function Plugin({ types: t }) {
  return {
    visitor: {
      CallExpression(path, state) {
        const { node } = path
        if (node.babelDidStripInvarants) {
          return
        }
        if (node.callee.name === '_invariant' && node.arguments.length > 1) {
          const newNode = t.callExpression(t.identifier('_invariant'), [
            ...node.arguments.slice(0, 1),
            t.stringLiteral(`invarerr-${uid++}`),
          ])
          newNode.babelDidStripInvarants = true
          path.replaceWith(newNode)
        }
      },
    },
  }
}
