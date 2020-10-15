import { StackProps } from '@dish/ui'
import { ViewStyle } from 'react-native'

import { bgLight, bgLightHover } from '../colors'

export const baseButtonStyle: ViewStyle = {
  // @ts-ignore
  cursor: 'pointer',
  paddingVertical: 5,
  paddingHorizontal: 8,
  borderRadius: 5,
  alignSelf: 'flex-start',
}

export const flatButtonStyle: ViewStyle = {
  ...baseButtonStyle,
  backgroundColor: bgLight,
}

export const flatButtonStyleInactive: StackProps = {
  ...baseButtonStyle,
  backgroundColor: 'rgba(220, 220, 220, 0.5)',
  hoverStyle: {
    backgroundColor: `rgba(220, 220, 220, 1)`,
  },
}

export const flatButtonStyleActive: StackProps = {
  ...baseButtonStyle,
  backgroundColor: 'rgba(200, 214, 255, 0.8)',
  hoverStyle: {
    backgroundColor: 'rgba(200, 214, 235, 1)',
  },
}

export const flatButtonStyleSelected: StackProps = {
  ...baseButtonStyle,
  backgroundColor: 'rgba(255,255,255, 1)',
}

export const circularFlatButtonStyle: StackProps = {
  ...flatButtonStyle,
  borderRadius: 10000,
}
