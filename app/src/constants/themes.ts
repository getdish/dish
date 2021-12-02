import { createTheme } from '@dish/ui'
import * as Colors from '@tamagui/colors'

import { colorNames } from './colors'
import { tokens } from './tokens'

const lightColors = Object.fromEntries(
  Object.entries(tokens.color).filter(([k]) => !k.endsWith('Dark'))
)
const darkColors = Object.fromEntries(
  Object.entries(tokens.color)
    .filter(([k]) => k.endsWith('Dark'))
    .map(([k, v]) => [k.replace('Dark', ''), v])
)

const lightBase = createTheme({
  bg: '#fff',
  bg2: tokens.color.gray3,
  bg3: tokens.color.gray4,
  bg4: tokens.color.gray5,
  bgDark: '#eee',
  bgCard: '#ffffff',
  bgTransparent: '#ffffff00',
  bgSemiTransparent: tokens.color.grayA1,
  borderColor: tokens.color.gray4,
  borderColor2: tokens.color.gray6,
  colorBright: '#000',
  color: tokens.color.gray12,
  color2: tokens.color.gray11,
  color3: tokens.color.gray10,
  color4: tokens.color.gray6,
  shadowColor: tokens.color.grayA5,
  shadowColor2: tokens.color.grayA6,
  mapBackground: '#ffffff',
})

type BaseTheme = typeof lightBase

const light: BaseTheme = {
  ...lightBase,
  ...lightColors,
}

const darkBase: BaseTheme = {
  bg: '#000',
  bg2: tokens.color.gray2Dark,
  bg3: tokens.color.gray3Dark,
  bg4: tokens.color.gray4Dark,
  bgDark: '#000',
  bgTransparent: '#00000000',
  bgSemiTransparent: tokens.color.grayA1Dark,
  borderColor: tokens.color.gray3Dark,
  borderColor2: tokens.color.gray4Dark,
  color: '#ddd',
  colorBright: '#fff',
  color2: tokens.color.gray11Dark,
  color3: tokens.color.gray10Dark,
  color4: tokens.color.gray6Dark,
  shadowColor: tokens.color.grayA6,
  shadowColor2: tokens.color.grayA7,
  mapBackground: '#151515',
  bgCard: '#333333',
}

const dark: BaseTheme = {
  ...darkBase,
  ...darkColors,
}

const colorThemes: Record<typeof colorNames[number], BaseTheme> = {} as any
for (const key of colorNames) {
  for (const scheme of ['light', 'dark']) {
    const isDark = scheme === 'dark'
    const colorKey = isDark ? `${key}Dark` : key
    const colorValues = Colors[colorKey]
    const offset = isDark ? -1 : 0
    const bgTransparent = colorValues[`${key}${2 + offset}`]
      .replace('hsl', 'hsla')
      .replace(')', ',0.2)')
    colorThemes[`${key}-${scheme}`] = {
      ...(isDark ? darkBase : lightBase),
      color: isDark ? '#fff' : '#000',
      color2: colorValues[`${key}12`],
      color3: colorValues[`${key}11`],
      color4: colorValues[`${key}10`],
      bg: colorValues[`${key}${2 + offset}`],
      bg2: colorValues[`${key}${3 + offset}`],
      bg3: colorValues[`${key}${4 + offset}`],
      bg4: colorValues[`${key}${5 + offset}`],
      bgTransparent,
      borderColor: colorValues[`${key}${4 + offset}`],
      borderColor2: colorValues[`${key}${5 + offset}`],
      bgDark: colorValues[`${key}${2 + offset}`],
      bgCard: colorValues[`${key}${3 + offset}`],
    }
  }
}

const activeLight: BaseTheme = {
  ...colorThemes['blue-light'],
  bg: tokens.color.blue12,
  bg2: tokens.color.blue11,
  bg3: tokens.color.blue10,
  bg4: tokens.color.blue9,
  color: tokens.color.blue1,
  color2: tokens.color.blue2,
}

const activeDark: BaseTheme = {
  ...colorThemes['blue-dark'],
  bg: tokens.color.blue1,
  bg2: tokens.color.blue3,
  bg3: tokens.color.blue3,
  bg4: tokens.color.blue5,
  color: tokens.color.blue10,
  color2: tokens.color.blue11,
}

const darkTranslucent: BaseTheme = createTheme({
  ...darkBase,
  bg: 'rgba(0,0,0,0.7)',
  bg2: 'rgba(0,0,0,0.5)',
  bg3: 'rgba(0,0,0,0.25)',
  bg4: 'rgba(0,0,0,0.1)',
})

const lightTranslucent: BaseTheme = createTheme({
  ...lightBase,
  bg: 'rgba(255,255,255,0.85)',
  bg2: 'rgba(250,250,250,0.85)',
  bg3: 'rgba(240,240,240,0.85)',
  bg4: 'rgba(240,240,240,0.7)',
})

export const themes = {
  dark,
  light,
  'active-light': activeLight,
  'active-dark': activeDark,
  'translucent-dark': darkTranslucent,
  'translucent-light': lightTranslucent,
  ...colorThemes,
} as const
