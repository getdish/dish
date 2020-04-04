import { StackBaseProps } from '../shared/Stacks'

export const baseButtonStyle: StackBaseProps = {
  paddingVertical: 5,
  borderRadius: 5,
  paddingHorizontal: 8,
}

export const lightLightBg = '#B8E0F322'
export const lightBg = 'rgba(220, 234, 255, 0.5)'
export const lightBgHover = `rgba(220, 234, 255, 1)`
export const bg = 'rgba(0, 34, 60, 0.8)'
export const bgHover = `rgba(0, 34, 60, 1)`

export const flatButtonStyle: StackBaseProps = {
  ...baseButtonStyle,
  backgroundColor: lightBg,
  hoverStyle: {
    backgroundColor: lightBgHover,
  },
}

export const flatButtonStyleInactive: StackBaseProps = {
  ...baseButtonStyle,
  backgroundColor: 'rgba(220, 220, 220, 0.5)',
  hoverStyle: {
    backgroundColor: `rgba(220, 220, 220, 1)`,
  },
}

export const flatButtonStyleActive: StackBaseProps = {
  ...baseButtonStyle,
  backgroundColor: 'rgba(200, 214, 255, 0.8)',
  hoverStyle: {
    backgroundColor: 'rgba(200, 214, 235, 1)',
  },
}

export const flatButtonStyleSelected: StackBaseProps = {
  ...baseButtonStyle,
  backgroundColor: 'rgba(255,255,255, 1)',
  // hoverStyle: {
  //   backgroundColor: 'rgba(240,240,240,1)',
  // },
}

export const circularFlatButtonStyle: StackBaseProps = {
  ...flatButtonStyle,
  borderRadius: 10000,
}
