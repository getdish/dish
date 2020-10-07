import { isString } from 'lodash'

export function isStringChild(node: any) {
  return isString(node) || (Array.isArray(node) && node.every(isString))
}
