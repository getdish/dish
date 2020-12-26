import { NodePath } from '@babel/core'
import * as t from '@babel/types'

export function hoistClassNames(
  path: NodePath<t.JSXElement>,
  existing: { [key: string]: t.Identifier },
  expr: t.Expression
) {
  const hoist = hoistClassNames.bind(null, path, existing)
  if (t.isStringLiteral(expr)) {
    if (expr.value.trim() === '') {
      return expr
    }
    if (existing[expr.value]) {
      return existing[expr.value]
    }
    const identifier = replaceStringWithVariable(expr)
    existing[expr.value] = identifier
    return identifier
  }
  if (t.isBinaryExpression(expr)) {
    return t.binaryExpression(
      expr.operator,
      hoist(expr.left),
      hoist(expr.right)
    )
  }
  if (t.isLogicalExpression(expr)) {
    return t.logicalExpression(
      expr.operator,
      hoist(expr.left),
      hoist(expr.right)
    )
  }
  if (t.isConditionalExpression(expr)) {
    return t.conditionalExpression(
      expr.test,
      hoist(expr.consequent),
      hoist(expr.alternate)
    )
  }
  return expr

  function replaceStringWithVariable(str: t.StringLiteral): t.Identifier {
    // hoist outside fn!
    const uid = path.scope.generateUidIdentifier('cn')
    const parent = path.findParent((path) => path.isProgram())
    if (!parent) throw new Error(`no program?`)
    const variable = t.variableDeclaration('const', [
      t.variableDeclarator(uid, str),
    ])
    // @ts-expect-error
    parent.unshiftContainer('body', variable)
    return uid
  }
}
