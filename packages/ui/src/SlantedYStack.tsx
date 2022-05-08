import { YStack, styled } from 'tamagui'

export const SlantedYStack = styled(YStack, {
  name: 'SlantedYStack',
  debug: true,
  backgroundColor: '$background',
  position: 'relative',
  zIndex: 10,
  paddingVertical: 8,
  paddingHorizontal: 10,
  shadowColor: '#000',
  shadowOpacity: 0.125,
  shadowRadius: 6,
  shadowOffset: { height: 2, width: 0 },
  borderRadius: 7,
  transform: [{ rotate: '-1.25deg' }],
})
