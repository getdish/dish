import { CornerLeftUp, X } from '@dish/react-feather'
import React, { memo } from 'react'
import { AbsoluteVStack } from 'snackui'
import { HStack, StackProps, useTheme } from 'snackui'

type CircleButtonProps = StackProps & {
  size?: number
  shadowed?: boolean
  subtle?: boolean
}

export const CloseButton = (props: CircleButtonProps) => {
  return (
    <SmallCircleButton {...props}>
      <X size={props.size ?? 14} color="white" />
    </SmallCircleButton>
  )
}

export const BackButton = memo((props: CircleButtonProps) => {
  return (
    <SmallCircleButton {...props}>
      <CornerLeftUp size={props.size} color="white" />
    </SmallCircleButton>
  )
})

export const SmallCircleButton = ({
  shadowed,
  children,
  width,
  height,
  minWidth,
  minHeight,
  padding = 9,
  subtle,
  ...props
}: CircleButtonProps) => {
  const theme = useTheme()
  if (props['debug']) console.log('shadowed', shadowed)
  return (
    <HStack
      borderRadius={1000}
      alignItems="center"
      justifyContent="center"
      hoverStyle={{
        opacity: 0.9,
      }}
      pressStyle={{
        opacity: 0.6,
      }}
      {...(shadowed && {
        shadowColor: theme.shadowColor,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
      })}
      {...(subtle && {
        backgroundColor: 'transparent',
        hoverStyle: {
          backgroundColor: theme.backgroundColorSecondary,
        },
        pressStyle: {
          backgroundColor: theme.backgroundColorTertiary,
        },
      })}
      width={width}
      height={height}
      minWidth={minWidth}
      minHeight={minHeight}
      padding={padding}
      {...props}
    >
      <AbsoluteVStack
        fullscreen
        borderRadius={1000}
        backgroundColor={theme.colorTertiary}
        zIndex={-1}
      />
      {children}
    </HStack>
  )
}
