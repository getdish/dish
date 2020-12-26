// import * as colors from './colors'

export type MyTheme = typeof dark
export type MyThemes = typeof themes

const shared = {}

const dark = {
  backgroundColorTransparent: 'rgba(0,0,0,0)',
  backgroundColorTranslucent: 'rgba(0,0,0,0.8)',
  backgroundColor: '#111',
  backgroundColorSecondary: '#222',
  backgroundColorSecondaryTranslucent: 'rgba(0,0,0,0.5)',
  backgroundColorTertiary: '#333',
  backgroundColorTertiaryTranslucent: 'rgba(0,0,0,0.25)',
  borderColor: '#252525',
  color: '#fefefe',
  colorSecondary: '#ccc',
  colorTertiary: '#777',
  cardBackgroundColor: '#333',
  ...shared,
}

const light: MyTheme = {
  backgroundColorTranslucent: 'rgba(255,255,255,0.85)',
  backgroundColorTransparent: 'rgba(255,255,255,0)',
  backgroundColor: '#fff',
  backgroundColorSecondary: '#f2f2f2',
  backgroundColorSecondaryTranslucent: 'rgba(255,255,255,0.5)',
  backgroundColorTertiary: '#eee',
  backgroundColorTertiaryTranslucent: 'rgba(255,255,255,0.25)',
  borderColor: '#eee',
  color: '#111',
  colorSecondary: '#444',
  colorTertiary: '#777',
  cardBackgroundColor: '#fff',
  ...shared,
}

const themes = {
  dark,
  light,
}

export default themes
