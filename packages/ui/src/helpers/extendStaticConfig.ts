import { TextStyle, ViewStyle } from 'react-native'

// duplicate of ui-static, we need shared types..
export type StaticConfig = {
  defaultStyle?: ViewStyle | TextStyle
  styleExpansionProps?: {
    [key: string]: ViewStyle | TextStyle
  }
}

export function extendStaticConfig(a: any, config: StaticConfig) {
  console.log('extendStaticConfig', a.staticConfig)
  return {
    defaultStyle: {
      ...a.staticConfig.defaultStyle,
      ...config.defaultStyle,
    },
    styleExpansionProps: {
      ...a.staticConfig.styleExpansionProps,
      ...config.styleExpansionProps,
    },
  }
}
