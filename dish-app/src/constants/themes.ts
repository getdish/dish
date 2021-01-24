// import * as colors from './colors'

export type MyTheme = typeof dark
export type MyThemes = typeof themes

const shared = {}

const active: MyTheme = {
  name: 'active',
  color: '#fff',
  colorSecondary: '#ccc',
  colorTertiary: '#777',
  colorQuartenary: '#444',
  shadowColor: `rgba(0,0,0,0.3)`,
  backgroundColor: 'rgb(152, 88, 255)',
  backgroundColorSecondary: 'rgb(152, 88, 255)',
  backgroundColorTertiary: 'rgba(152, 88, 255, 0.85)',
  backgroundColorQuartenary: 'rgba(152, 88, 255, 0.7)',
  borderColor: 'rgb(142, 78, 245)',
  borderColorHover: 'rgb(132, 68, 235)',
  backgroundColorTransparent: 'rgba(40,40,200,0)',
  cardBackgroundColor: '#333',
}

const error: MyTheme = {
  name: 'error',
  color: '#fff',
  colorSecondary: '#ccc',
  colorTertiary: '#777',
  colorQuartenary: '#444',
  shadowColor: `rgba(0,0,0,0.3)`,
  backgroundColor: 'rgb(245, 38, 102)',
  backgroundColorSecondary: 'rgb(245, 38, 102)',
  backgroundColorTertiary: 'rgba(245, 38, 102, 0.85)',
  backgroundColorQuartenary: 'rgba(245, 38, 102, 0.7)',
  borderColor: 'rgb(205, 28, 92)',
  borderColorHover: 'rgb(205, 28, 92)',
  backgroundColorTransparent: 'rgba(40,40,200,0)',
  cardBackgroundColor: '#333',
}

const darkBase = {
  borderColor: '#252525',
  borderColorHover: '#353535',
  color: '#fefefe',
  colorSecondary: '#ccc',
  colorTertiary: '#777',
  colorQuartenary: '#aaa',
  cardBackgroundColor: '#333',
  shadowColor: `rgba(0,0,0,0.7)`,
  backgroundColorTransparent: 'rgba(0,0,0,0)',
}

const dark = {
  name: 'dark',
  ...shared,
  ...darkBase,
  backgroundColor: '#222',
  backgroundColorSecondary: '#333',
  backgroundColorTertiary: '#444',
  backgroundColorQuartenary: '#555',
}

const darkTranslucent: MyTheme = {
  name: 'darkTranslucent',
  ...shared,
  ...darkBase,
  backgroundColor: 'rgba(0,0,0,0.8)',
  backgroundColorSecondary: 'rgba(0,0,0,0.5)',
  backgroundColorTertiary: 'rgba(0,0,0,0.25)',
  backgroundColorQuartenary: 'rgba(0,0,0,0.1)',
}

const lightBase = {
  borderColor: '#eee',
  borderColorHover: '#d5d5d5',
  color: '#111',
  colorSecondary: '#444',
  colorTertiary: '#777',
  colorQuartenary: '#aaa',
  cardBackgroundColor: '#fff',
  backgroundColorTransparent: 'rgba(255,255,255,0)',
  shadowColor: `rgba(0,0,0,0.24)`,
}

const light: MyTheme = {
  name: 'light',
  ...shared,
  ...lightBase,
  backgroundColor: '#fff',
  backgroundColorSecondary: '#f2f2f2',
  backgroundColorTertiary: '#ddd',
  backgroundColorQuartenary: '#bbb',
}

const lightTranslucent: MyTheme = {
  name: 'lightTranslucent',
  ...shared,
  ...lightBase,
  backgroundColor: 'rgba(255,255,255,0.85)',
  backgroundColorSecondary: 'rgba(250,250,250,0.85)',
  backgroundColorTertiary: 'rgba(240,240,240,0.85)',
  backgroundColorQuartenary: 'rgba(240,240,240,0.7)',
}

const themes = {
  dark,
  light,
  lightTranslucent,
  darkTranslucent,
  active,
  error,
}

export default themes
