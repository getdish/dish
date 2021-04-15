import { CornerLeftUp, X } from '@dish/react-feather'
import React, { memo } from 'react'
import { Pressable } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { HStack, StackProps, VStack, useTheme } from 'snackui'

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
  padding = 6,
  subtle,
  ...props
}: CircleButtonProps) => {
  const theme = useTheme()
  return (
    <HStack
      borderRadius={1000}
      backgroundColor={theme.colorQuartenary}
      alignItems="center"
      justifyContent="center"
      hoverStyle={{
        backgroundColor: theme.colorTertiary,
      }}
      pressStyle={{
        backgroundColor: theme.colorQuartenary,
      }}
      {...(shadowed && {
        shadowColor: 'rgba(0,0,0,0.25)',
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
      {children}
    </HStack>
  )
}
