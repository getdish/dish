// import * as colors from './colors'

export type MyTheme = typeof dark
export type MyThemes = typeof themes

const shared = {}

const active: MyTheme = {
  name: 'active',
  color: '#fff',
  colorSecondary: '#ccc',
  colorTertiary: '#777',
  backgroundColor: '#204493',
  backgroundColorSecondary: '#20449399',
  backgroundColorTertiary: '#20449344',
  borderColor: '#204493',
  backgroundColorTransparent: 'rgba(40,40,200,0)',
  cardBackgroundColor: '#333',
}

const darkBase = {
  borderColor: '#252525',
  color: '#fefefe',
  colorSecondary: '#ccc',
  colorTertiary: '#777',
  cardBackgroundColor: '#333',
  backgroundColorTransparent: 'rgba(0,0,0,0)',
}

const dark = {
  name: 'dark',
  ...shared,
  ...darkBase,
  backgroundColor: '#111',
  backgroundColorSecondary: '#222',
  backgroundColorTertiary: '#333',
}

const darkTranslucent: MyTheme = {
  name: 'darkTranslucent',
  ...shared,
  ...darkBase,
  backgroundColor: 'rgba(0,0,0,0.8)',
  backgroundColorSecondary: 'rgba(0,0,0,0.5)',
  backgroundColorTertiary: 'rgba(0,0,0,0.25)',
}

const lightBase = {
  borderColor: '#eee',
  color: '#111',
  colorSecondary: '#444',
  colorTertiary: '#777',
  cardBackgroundColor: '#fff',
  backgroundColorTransparent: 'rgba(255,255,255,0)',
}

const light: MyTheme = {
  name: 'light',
  ...shared,
  ...lightBase,
  backgroundColor: '#fff',
  backgroundColorSecondary: '#f2f2f2',
  backgroundColorTertiary: '#eee',
}

const lightTranslucent: MyTheme = {
  name: 'lightTranslucent',
  ...shared,
  ...lightBase,
  backgroundColor: 'rgba(255,255,255,0.85)',
  backgroundColorSecondary: 'rgba(255,255,255,0.5)',
  backgroundColorTertiary: 'rgba(255,255,255,0.25)',
}

const themes = {
  dark,
  light,
  lightTranslucent,
  darkTranslucent,
  active,
}

export default themes
