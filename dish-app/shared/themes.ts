// import * as colors from './colors'

export type MyTheme = typeof dark
export type MyThemes = typeof themes

const dark = {
  backgroundColorTransparent: 'rgba(0,0,0,0)',
  backgroundColor: '#111',
  backgroundColorSecondary: '#222',
  borderColor: '#252525',
  color: '#fefefe',
  colorSecondary: '#eee',
  cardBackgroundColor: '#333',
}

const light: MyTheme = {
  backgroundColorTransparent: 'rgba(255,255,255,0)',
  backgroundColor: '#fff',
  backgroundColorSecondary: '#f2f2f2',
  borderColor: '#eee',
  color: '#000',
  colorSecondary: '#222',
  cardBackgroundColor: '#fff',
}

const themes = {
  dark,
  light,
}

export default themes
