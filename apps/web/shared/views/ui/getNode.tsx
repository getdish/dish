import { findNodeHandle } from 'react-native'

export const getNode = (refCurrent: any) => {
  return findNodeHandle(refCurrent)
}
