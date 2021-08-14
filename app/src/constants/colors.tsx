// TODO all greys
export const lightGrey = '#eeeeee'
export const grey = `#999999`
export const darkGrey = `#555555`

// all indices must match going down
export const colorNames = ['yellow', 'pink', 'green', 'red', 'orange', 'blue', 'purple'] as const

export const yellow50 = '#F7F6EB'
export const pink50 = '#F7EDF1'
export const green50 = '#EDF7F2'
export const red50 = '#F7F1ED'
export const orange50 = '#FFF9F5'
export const blue50 = '#F0FAFF'
export const purple50 = '#F5EEF8'
export const colors50 = [yellow50, pink50, green50, red50, orange50, blue50, purple50]

export const yellow100 = '#F7F3DA'
export const pink100 = '#F7D7E2'
export const green100 = '#D7F7E5'
export const red100 = '#F7E6DA'
export const orange100 = '#F7E6DA'
export const blue100 = '#DAEDF7'
export const purple100 = '#C2A2E0'
export const colors100 = [yellow100, pink100, green100, red100, orange100, blue100, purple100]

export const yellow200 = '#E0D8A2'
export const pink200 = '#E0A2B7'
export const green200 = '#A4E0BE'
export const red200 = '#F0ADAD'
export const orange200 = '#E6BDA1'
export const blue200 = '#A0B2DE'
export const purple200 = '#C2A2E0'
export const colors200 = [yellow200, pink200, green200, red200, orange200, blue200, purple200]

export const yellow300 = '#C4BC86'
export const pink300 = '#B0788A'
export const green300 = '#78B090'
export const red300 = '#C28484'
export const orange300 = '#B8957D'
export const blue300 = '#7F90BA'
export const purple300 = '#9B7DB8'
export const colors300 = [yellow300, pink300, green300, red300, orange300, blue300, purple300]

export const yellow400 = '#C7B750'
export const pink400 = '#C7507C'
export const green400 = '#4ABA7B'
export const red400 = '#C75050'
export const orange400 = '#C78150'
export const blue400 = '#5072C7'
export const purple400 = '#8D50C7'
export const colors400 = [yellow400, pink400, green400, red400, orange400, blue400, purple400]

export const yellow500 = '#948946'
export const pink500 = '#994864'
export const green500 = '#449166'
export const red500 = '#964747'
export const orange500 = '#996A48'
export const blue500 = '#465E94'
export const purple500 = '#724899'
export const colors500 = [yellow500, pink500, green500, red500, orange500, blue500, purple500]

export const yellow600 = '#746D43'
export const pink600 = '#8C5165'
export const green600 = '#46785A'
export const red600 = '#7D4848'
export const orange600 = '#80604A'
export const blue600 = '#47577A'
export const purple600 = '#6A4D85'
export const colors600 = [yellow600, pink600, green600, red600, orange600, blue600, purple600]

export const yellow700 = '#4D4934'
export const pink700 = '#4D343C'
export const green700 = '#344D3F'
export const red700 = '#4D3434'
export const orange700 = '#4D3E34'
export const blue700 = '#343C4D'
export const purple700 = '#41344D'
export const colors700 = [yellow700, pink700, green700, red700, orange700, blue700, purple700]

export const yellow800 = '#383731'
export const pink800 = '#383134'
export const green800 = '#313834'
export const red800 = '#383131'
export const orange800 = '#383531'
export const blue800 = '#313338'
export const purple800 = '#363138'
export const colors800 = [yellow800, pink800, green800, red800, orange800, blue800, purple800]

export const yellow900 = '#2B2B29'
export const pink900 = '#2B292A'
export const green900 = '#292B2A'
export const red900 = '#2B2929'
export const orange900 = '#2B2A29'
export const blue900 = '#29292B'
export const purple900 = '#2A292B'
export const colors900 = [yellow900, pink900, green900, red900, orange900, blue900, purple900]

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
  color900: string
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
    color900: colors900[index],
    altColor: colors400[altIndex],
    altPastelColor: colors200[altIndex],
  }
}

export const bgAlt = blue300
export const bgLight = pink100
export const bgLightTranslucent = `${pink100}55`
export const bgLightHover = pink50
export const bgLightPress = pink200
export const brandColor = `#FF276F`
