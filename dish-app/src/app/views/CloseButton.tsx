import { CornerLeftUp, X } from '@dish/react-feather'
import React, { memo } from 'react'
import { HStack, StackProps, VStack, useTheme } from 'snackui'

type CircleButtonProps = StackProps & { size?: number; shadowed?: boolean }

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
  padding = 6,
  ...props
}: CircleButtonProps) => {
  const theme = useTheme()
  return (
    <VStack {...props} padding={10} margin={-10}>
      <HStack
        borderRadius={1000}
        backgroundColor={theme.colorQuartenary}
        alignItems="center"
        justifyContent="center"
        hoverStyle={{
          backgroundColor: theme.colorTertiary,
        }}
        pressStyle={{
          backgroundColor: '#222',
        }}
        {...(shadowed && {
          shadowColor: 'rgba(0,0,0,0.25)',
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 2 },
        })}
        {...{ width, height, minWidth, minHeight, padding }}
      >
        {children}
      </HStack>
    </VStack>
  )
}
