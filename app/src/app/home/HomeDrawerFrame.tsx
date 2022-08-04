import { drawerWidthMax } from '../../constants/constants'
import { YStack } from '@dish/ui'
import { styled } from '@tamagui/core'

export const DrawerFrameBg = styled(YStack, {
  opacity: 0.2,
  zi: -1,
  fullscreen: true,
  br: '$6',
  backgroundColor: '$background',
})

export const DrawerFrame = styled(YStack, {
  pos: 'relative',
  className: 'blur',
  bc: '$backgroundDrawer',
  br: '$6',
  pointerEvents: 'auto',
  maxWidth: drawerWidthMax,
  f: 1,
  zIndex: 10,
  flex: 1,
  shadowColor: 'rgba(0,0,0,0.135)',
  shadowRadius: 7,
  shadowOffset: {
    height: 4,
    width: 0,
  },
  bw: 1,
  boc: '$borderColor',
  justifyContent: 'flex-end',
})
