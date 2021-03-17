import { linearGradient, themes as UIThemes, toColor } from '@o/ui'
import { createThemes } from 'gloss'
import { colorize, fromStyles } from 'gloss-theme'

import { colors } from './colors'

const buttonBackground = linearGradient(colors.purple.lighten(0.035), colors.purple)

const purple = fromStyles({
  background: colors.purple,
  color: '#fff',
})

const selected = {
  ...purple,
  // dont make selected things hover/active, they're active already
  backgroundHover: purple.background,
  backgroundActive: purple.background,
}

const light = {
  ...UIThemes.light,
  backgroundHighlightActive: colors.purple.lighten(0.1),
  backgroundHighlight: colors.purple,
  coats: {
    ...UIThemes.light.coats,
    selected,
    purple,
  },
}

const dark = {
  ...UIThemes.dark,
  coats: {
    ...UIThemes.dark.coats,
    selected,
    purple,
  },
  ...colorize({
    background: '#111',
    popoverBackground: '#111',
  }),
}

const home = {
  ...dark,
  ...colorize({
    background: '#000',
    backgroundHover: '#111',

    popover: {
      background: '#111',
    },
  }),
}

export const themes = createThemes({
  ...UIThemes,

  // TODO cant we remove everything but the buton: {} subset?
  orbitOneDark: fromStyles({
    background: '#111',
    backgroundHover: '#111',
    borderColor: '#222',
    color: '#fff',

    button: {
      background: buttonBackground,
      backgroundHover: buttonBackground.adjust(c => toColor(c).lighten(0.035)),
    },
  }),

  light,

  dark: {
    ...dark,
    background: toColor('#080808'),
  },

  home,

  blogHeaderTheme: {
    ...purple,
    background: purple.background.darken(0.1),
  },

  docsPageTheme: {
    ...light,
    color: toColor('#111'),
    bodyBackground: toColor('#000'),
  },
})

window['themes'] = themes
