import { Input, styled } from 'tamagui'

export const SearchInput = styled(Input, {
  name: 'SearchInput',
  flex: 1,
  borderRadius: 0,
  backgroundColor: 'transparent',
  borderWidth: 0,
  fontFamily: '$stylish',
  fontSize: 42,
  fontWeight: '500',
  letterSpacing: -1,
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
