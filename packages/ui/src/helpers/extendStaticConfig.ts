import { TextStyle, ViewStyle } from 'react-native'

export type StaticComponent<A> = ((props: A) => JSX.Element) & {
  staticConfig: StaticConfig
}

// duplicate of ui-static, we need shared types..
export type StaticConfig = {
  defaultStyle?: any
  styleExpansionProps?: {
    [key: string]: ViewStyle | TextStyle
  }
}

export function extendStaticConfig(a: any, config: StaticConfig) {
  if (process.env.TARGET === 'client') {
    return
  }
  if (!a.staticConfig) {
    throw new Error(`No static config: ${a} ${JSON.stringify(config)}`)
  }
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
