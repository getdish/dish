// TODO all greys
export const lightGrey = '#eeeeee'
export const grey = `#999999`
export const darkGrey = `#555555`

// all indices must match going down
export const colorNames = ['yellow', 'pink', 'green', 'red', 'orange', 'blue', 'purple'] as const

export const yellow50 = '#F7F6ED'
export const pink50 = '#F7EDF1'
export const green50 = '#EDF7F2'
export const red50 = '#F7F1ED'
export const orange50 = '#FFF9F5'
export const blue50 = '#F0FAFF'
export const purple50 = '#F5EEF8'
export const colors50 = [yellow50, pink50, green50, red50, orange50, blue50, purple50]

export const yellow100 = '#F7EFCB'
export const pink100 = '#F7CBDA'
export const green100 = '#CBF7DE'
export const red100 = '#F7DDCB'
export const orange100 = '#F7DDCB'
export const blue100 = '#CBE9F7'
export const purple100 = '#E2CBF8'
export const colors100 = [yellow100, pink100, green100, red100, orange100, blue100, purple100]

export const yellow200 = '#E0D5A2'
export const pink200 = '#E0A2B9'
export const green200 = '#A4E0BD'
export const red200 = '#F0ADAD'
export const orange200 = '#E6BDA1'
export const blue200 = '#A0B2DE'
export const purple200 = '#C2A2E0'
export const colors200 = [yellow200, pink200, green200, red200, orange200, blue200, purple200]

export const yellow300 = '#C4B986'
export const pink300 = '#B0788D'
export const green300 = '#78B08F'
export const red300 = '#C28484'
export const orange300 = '#C7A287'
export const blue300 = '#7F90BA'
export const purple300 = '#9B7DB8'
export const colors300 = [yellow300, pink300, green300, red300, orange300, blue300, purple300]

export const yellow400 = '#948A48'
export const pink400 = '#C94878'
export const green400 = '#46AF73'
export const red400 = '#C74848'
export const orange400 = '#C77E4A'
export const blue400 = '#4A6EC7'
export const purple400 = '#8A4AC7'
export const colors400 = [yellow400, pink400, green400, red400, orange400, blue400, purple400]

export const yellow500 = '#94883A'
export const pink500 = '#99405F'
export const green500 = '#2D9157'
export const red500 = '#962D2D'
export const orange500 = '#996139'
export const blue500 = '#2C4D94'
export const purple500 = '#673199'
export const colors500 = [yellow500, pink500, green500, red500, orange500, blue500, purple500]

export const yellow600 = '#746C3D'
export const pink600 = '#8C3855'
export const green600 = '#267848'
export const red600 = '#7D2C2C'
export const orange600 = '#80512F'
export const blue600 = '#25407A'
export const purple600 = '#592A85'
export const colors600 = [yellow600, pink600, green600, red600, orange600, blue600, purple600]

export const yellow700 = '#403C23'
export const pink700 = '#4D1528'
export const green700 = '#18452B'
export const red700 = '#4D1818'
export const orange700 = '#4D301B'
export const blue700 = '#182747'
export const purple700 = '#361852'
export const colors700 = [yellow700, pink700, green700, red700, orange700, blue700, purple700]

export const yellow800 = '#282B1A'
export const pink800 = '#2B2426'
export const green800 = '#192B22'
export const red800 = '#2B1C1C'
export const orange800 = '#231B13'
export const blue800 = '#1C202B'
export const purple800 = '#261B2B'
export const colors800 = [yellow800, pink800, green800, red800, orange800, blue800, purple800]

// WARNING IVE UPDATED THIS FROM SKETCH, THIS IS SOURCE OF TRUTH NOW
export const yellow = yellow400
export const pink = pink400
export const green = green400
export const red = red400
export const orange = orange400
export const blue = blue400
export const purple = purple400
export const colors = [yellow, pink, green, red, orange, blue, purple]

export const colorObjects: {
  name: string
  color50: string
  color100: string
  color200: string
  color300: string
  color: string
  color400: string
  color500: string
  color600: string
  color700: string
  color800: string
  altColor: string
  altPastelColor: string
}[] = []

for (const [index, name] of colorNames.entries()) {
  const altIndex = (index + 1) % colors.length
  colorObjects[index] = {
    name,
    color50: colors50[index],
    color100: colors100[index],
    color200: colors200[index],
    color300: colors300[index],
    color: colors400[index],
    color400: colors400[index],
    color500: colors500[index],
    color600: colors600[index],
    color700: colors700[index],
    color800: colors800[index],
    altColor: colors400[altIndex],
    altPastelColor: colors200[altIndex],
  }
}

export const bgAlt = blue300
export const bgLight = pink100
export const bgLightTranslucent = `${pink100}55`
export const bgLightHover = pink50
export const bgLightPress = pink200
export const brandColor = `#E3236A`
export const brandColorDark = pink600
export const brandColorDarker = pink700
export const brandColorLight = pink300
export const brandColorLighter = pink200
