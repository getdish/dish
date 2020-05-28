import { ViewStyle } from 'react-native'
import { atomic } from 'react-native-web/dist/exports/StyleSheet/compile'

export { ViewStyle } from 'react-native'

export function getStylesAtomic(style: ViewStyle) {
  const styles: {
    [key: string]: {
      property: string
      value: string
      // same as key
      identifier: string
      // css full statement
      rules: string[]
    }
  } = atomic(style)

  return Object.keys(styles).map((key) => styles[key])
}
