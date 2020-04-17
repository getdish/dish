import { StackProps } from '../ui/Stacks'
import { bgLight, bgLightHover } from './colors'

export const baseButtonStyle: StackProps = {
  paddingVertical: 5,
  borderRadius: 5,
  paddingHorizontal: 8,
}

export const flatButtonStyle: StackProps = {
  ...baseButtonStyle,
  backgroundColor: bgLight,
  hoverStyle: {
    backgroundColor: bgLightHover,
  },
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
  // hoverStyle: {
  //   backgroundColor: 'rgba(240,240,240,1)',
  // },
}

export const circularFlatButtonStyle: StackProps = {
  ...flatButtonStyle,
  borderRadius: 10000,
}
