import generate from '@babel/generator'
import * as t from '@babel/types'
import invariant from 'invariant'

import { CacheObject } from '../types'

export interface Ternary {
  name: string
  test: t.Expression
  consequent: string | null
  alternate: string | null
}

const empty = {
  css: '',
  className: '',
}

export function extractStaticTernaries(
  ternaries: Ternary[],
  cacheObject: CacheObject
): {
  /** styles to be extracted */
  stylesByClassName: { [key: string]: string }
  /** ternaries grouped into one binary expression */
  ternaryExpression: t.BinaryExpression | t.ConditionalExpression
} | null {
  invariant(
    Array.isArray(ternaries),
    'extractStaticTernaries expects param 1 to be an array of ternaries'
  )
  invariant(
    typeof cacheObject === 'object' && cacheObject !== null,
    'extractStaticTernaries expects param 3 to be an object'
  )

  if (ternaries.length === 0) {
    return null
  }

  const ternariesByKey: Record<
    string,
    {
      test: t.Expression
      consequentStyles: any //CSSProperties
      alternateStyles: any //CSSProperties
    }
  > = {}
  for (let idx = -1, len = ternaries.length; ++idx < len; ) {
    const { name, test, consequent, alternate } = ternaries[idx]

    let ternaryTest = test

    // strip parens
    if (t.isExpressionStatement(test)) {
      ternaryTest = (test as any).expression
    }

    // convert `!thing` to `thing` with swapped consequent and alternate
    let shouldSwap = false
    if (t.isUnaryExpression(test) && test.operator === '!') {
      ternaryTest = test.argument
      shouldSwap = true
    } else if (t.isBinaryExpression(test)) {
      if (test.operator === '!==') {
        ternaryTest = t.binaryExpression('===', test.left, test.right)
        shouldSwap = true
      } else if (test.operator === '!=') {
        ternaryTest = t.binaryExpression('==', test.left, test.right)
        shouldSwap = true
      }
    }

    const key = generate(ternaryTest).code
    ternariesByKey[key] = ternariesByKey[key] || {
      alternateStyles: {},
      consequentStyles: {},
      test: ternaryTest,
    }
    ternariesByKey[key].consequentStyles[name] = shouldSwap
      ? alternate
      : consequent
    ternariesByKey[key].alternateStyles[name] = shouldSwap
      ? consequent
      : alternate
  }

  const stylesByClassName: { [key: string]: string } = {}

  const ternaryExpression = Object.keys(ternariesByKey)
    .map((key, idx) => {
      const { test, consequentStyles, alternateStyles } = ternariesByKey[key]
      const { className: consequentClassName, css: consequentCSS } = {} as any //StaticUtils.getStyles(consequentStyles) ?? empty
      const { className: alternateClassName, css: alternateCSS } = {} as any //StaticUtils.getStyles(alternateStyles) ?? empty

      if (!consequentClassName && !alternateClassName) {
        return null
      }

      if (consequentClassName) {
        stylesByClassName[consequentClassName] = consequentCSS
      }

      if (alternateClassName) {
        stylesByClassName[alternateClassName] = alternateCSS
      }

      if (consequentClassName && alternateClassName) {
        if (idx > 0) {
          // if it's not the first ternary, add a leading space
          return t.binaryExpression(
            '+',
            t.stringLiteral(' '),
            t.conditionalExpression(
              test,
              t.stringLiteral(consequentClassName),
              t.stringLiteral(alternateClassName)
            )
          )
        } else {
          return t.conditionalExpression(
            test,
            t.stringLiteral(consequentClassName),
            t.stringLiteral(alternateClassName)
          )
        }
      } else {
        // if only one className is present, put the padding space inside the ternary
        return t.conditionalExpression(
          test,
          t.stringLiteral(
            (idx > 0 && consequentClassName ? ' ' : '') + consequentClassName
          ),
          t.stringLiteral(
            (idx > 0 && alternateClassName ? ' ' : '') + alternateClassName
          )
        )
      }
    })
    .filter(Boolean)
    .reduce(
      (acc, val) => (acc && val ? t.binaryExpression('+', acc, val) : val),
      null
    )

  if (!ternaryExpression) {
    return null
  }

  return { stylesByClassName, ternaryExpression }
}
