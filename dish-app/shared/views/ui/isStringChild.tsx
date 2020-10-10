import { isNumber, isString } from 'lodash'

export function isStringChild(node: any) {
  return (
    isNumber(node) ||
    isString(node) ||
    (Array.isArray(node) && node.every((x) => isString(x) || isNumber(x)))
  )
}
