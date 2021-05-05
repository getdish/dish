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
      <X size={props.size ?? 14} color="#fff" />
    </SmallCircleButton>
  )
}

export const BackButton = memo((props: CircleButtonProps) => {
  return (
    <SmallCircleButton {...props}>
      <CornerLeftUp size={props.size} color="#fff" />
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
  return (
    <HStack
      borderRadius={1000}
      alignItems="center"
      justifyContent="center"
      backgroundColor={theme.colorQuartenary}
      hoverStyle={{
        backgroundColor: theme.colorSecondary,
      }}
      pressStyle={{
        backgroundColor: theme.color,
      }}
      {...(shadowed && {
        shadowColor: theme.shadowColor,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
      })}
      width={width}
      height={height}
      minWidth={minWidth}
      minHeight={minHeight}
      padding={padding}
      {...props}
    >
      {children}
    </HStack>
  )
}
