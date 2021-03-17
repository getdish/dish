const systemFont = `-apple-system, "SF Pro Text", BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Droid Sans', sans-serif`

export const fontProps = {
  TitleFont: {
    fontFamily: 'GTEesti',
    // WebkitFontSmoothing: 'initial',
  },
  BodyFont: {
    fontFamily: `${systemFont}`,
    // WebkitFontSmoothing: 'antialiased',
  },
  SystemFont: {
    fontFamily: systemFont,
  },
}

// for now just copied to gloss, its a decent default set
// need to manually sync to gloss/configureGloss
export const widths = {
  xs: 420,
  sm: 700,
  md: 820,
  lg: 1150,
}
export const mediaQueries = {
  xs: `@media screen and (max-width: ${widths.xs - 1}px)`,
  sm: `@media screen and (max-width: ${widths.sm}px)`,
  abovesm: `@media screen and (min-width: ${widths.sm + 1}px)`,
  md: `@media screen and (max-width: ${widths.md}px)`,
  belowmd: `@media screen and (max-width: ${widths.md}px)`,
  abovemd: `@media screen and (min-width: ${widths.md + 1}px)`,
  lg: `@media screen and (min-width: ${widths.lg}px)`,
  belowlg: `@media screen and (max-width: ${widths.lg}px)`,
  abovelg: `@media screen and (min-width: ${widths.lg + 1}px)`,
}

export const sectionMaxHeight = 1250
export const sidePad = 24

type MediaQueryObject = { [key in keyof typeof mediaQueries]: Object }

const hiddenWhen: MediaQueryObject = Object.keys(mediaQueries).reduce((acc, key) => {
  acc[key] = {
    [`${key}-display`]: 'none',
    [`${key}-pointerEvents`]: 'none',
  }
  return acc
}, {}) as any

const visibleWhen: MediaQueryObject = Object.keys(mediaQueries).reduce((acc, key) => {
  acc[key] = {
    display: 'none',
    [`${key}-display`]: 'flex',
  }
  return acc
}, {}) as any

export const mediaStyles = {
  hiddenWhen,
  visibleWhen,
}
