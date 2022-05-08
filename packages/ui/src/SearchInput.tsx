import { Input, styled } from 'tamagui'

export const SearchInput = styled(Input, {
  name: 'SearchInput',
  flex: 1,
  borderRadius: 0,
  backgroundColor: 'transparent',
  borderWidth: 0,
  shadowOpacity: 0,
  fontWeight: '500',

  focusStyle: {
    borderWidth: 0,
    margin: 0,
  },
})
