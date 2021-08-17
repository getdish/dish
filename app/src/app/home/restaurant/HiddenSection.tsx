import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { AbsoluteHStack, Button, LinearGradient, VStack, useTheme } from 'snackui'

export const HiddenSection = (props: {
  children: any
  cutoff: number
  onChangeOpen?: (isOpen: boolean) => any
}) => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <VStack overflow="hidden" position="relative" maxHeight={open ? 10000 : props.cutoff}>
      {props.children}
      <AbsoluteHStack zIndex={10} bottom={0} left={0} right={0} justifyContent="center">
        <Button
          onClick={() =>
            setOpen((x) => {
              const next = !x
              props.onChangeOpen?.(next)
              return next
            })
          }
        >
          {open ? 'Close' : 'Show full menu'}
        </Button>
      </AbsoluteHStack>
      <LinearGradient
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { top: '50%', opacity: open ? 0 : 1 }]}
        start={[0, 0]}
        end={[0, 1]}
        colors={[theme.backgroundColorTransparent, theme.backgroundColor]}
      />
    </VStack>
  )
}
