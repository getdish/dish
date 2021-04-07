export type MyTheme = typeof dark
export type MyThemes = typeof themes

const darkBase = {
  backgroundColorAlt: 'rgba(240, 250, 255, 0.1)',
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
  ...darkBase,
  backgroundColor: '#222',
  backgroundColorSecondary: '#333',
  backgroundColorTertiary: '#444',
  backgroundColorQuartenary: '#555',
}

const lightBase = {
  backgroundColorAlt: 'rgb(240, 250, 255)',
  borderColor: '#eee',
  borderColorHover: '#d5d5d5',
  color: '#111',
  colorSecondary: '#444',
  colorTertiary: '#777',
  colorQuartenary: '#aaa',
  cardBackgroundColor: '#fff',
  backgroundColorTransparent: 'rgba(255,255,255,0)',
  shadowColor: `rgba(0,0,0,0.1)`,
}

const light: MyTheme = {
  name: 'light',
  ...lightBase,
  backgroundColor: '#fff',
  backgroundColorSecondary: '#f2f2f2',
  backgroundColorTertiary: '#e9e9e9',
  backgroundColorQuartenary: '#d9d9d9',
}

const themes = {
  dark,
  light,
}

if (typeof window !== 'undefined') {
  window['themes'] = window['themes'] || themes
}

export default themes
