import { Input, styled } from 'tamagui'

export const SearchInput = styled(Input, {
  name: 'SearchInput',
  flex: 1,
  // this is necessary otherwise it flexes way past containers
  width: '100%',
  borderRadius: 0,
  backgroundColor: 'transparent',
  borderWidth: 0,
  fontFamily: '$body',
  size: '$7',
  // fontFamily: '$stylish',
  // fontSize: 62,
  // lineHeight: 62,
  // height: 82,
  fontWeight: '500',
  shadowOpacity: 0,

  focusStyle: {
    borderWidth: 0,
    margin: 0,
  },

  variants: {
    floating: {
      true: {
        fontSize: 18,
      }
    }
  }
})
