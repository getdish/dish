import generate from '@babel/generator'
import * as t from '@babel/types'
import invariant from 'invariant'
import { ViewStyle } from 'react-native'

import { getStylesAtomic } from '../style/getStylesAtomic'
import { CacheObject, ClassNameToStyleObj } from '../types'

export interface Ternary {
  name: string
  test: t.Expression
  consequent: string | null
  alternate: string | null
}

export type TernaryRecord = {
  test: t.Expression
  consequentStyles: any //CSSProperties
  alternateStyles: any //CSSProperties
}

export function extractStaticTernaries(
  ternaries: Ternary[],
  cacheObject: CacheObject,
  baseStyles: ViewStyle
) {
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

  const ternariesByKey: Record<string, TernaryRecord> = {}

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

  const stylesByClassName: ClassNameToStyleObj = {}

  const ternaryExpression = Object.keys(ternariesByKey).map((key) => {
    return ternariesByKey[key]
  })

  if (!ternaryExpression) {
    return null
  }

  return { stylesByClassName, ternaryExpression }
}
