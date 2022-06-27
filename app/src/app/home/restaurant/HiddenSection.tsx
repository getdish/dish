import { AbsoluteXStack, Button, LinearGradient, YStack } from '@dish/ui'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

export const HiddenSection = (props: {
  children: any
  cutoff: number
  onChangeOpen?: (isOpen: boolean) => any
}) => {
  const [open, setOpen] = useState(false)
  return (
    <YStack overflow="hidden" position="relative" maxHeight={open ? 10000 : props.cutoff}>
      {props.children}
      <AbsoluteXStack zIndex={10} bottom={0} left={0} right={0} justifyContent="center">
        <Button
          onPress={() =>
            setOpen((x) => {
              const next = !x
              props.onChangeOpen?.(next)
              return next
            })
          }
        >
          {open ? 'Close' : 'Show full menu'}
        </Button>
      </AbsoluteXStack>
      <LinearGradient
        pointerEvents="none"
        fullscreen
        top="50%"
        opacity={open ? 0 : 1}
        start={[0, 0]}
        end={[0, 1]}
        colors={['$backgroundTransparent', '$background']}
      />
    </YStack>
  )
}
