import { AbsoluteVStack, LinearGradient, StackProps, VStack } from '@dish/ui'
import React from 'react'
import { StyleSheet } from 'react-native'

export const Squircle = ({
  width = 100,
  height = 100,
  borderRadius = 18,
  isHovered,
  children,
  ...rest
}: StackProps & {
  isHovered?: boolean
}) => {
  return (
    <>
      {/* frame (shadow) */}
      <VStack
        width={width}
        height={height}
        borderRadius={borderRadius}
        position="relative"
        {...rest}
      >
        {/* frame (inner) */}
        <VStack
          className="ease-in-out-fast"
          shadowColor="rgba(0,0,0,0.4)"
          shadowRadius={4}
          shadowOffset={{ width: 0, height: 3 }}
          flex={1}
          borderRadius={borderRadius - 1}
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
          {...(isHovered && {
            // borderColor: 'rgba(0,0,0,0.75)',
            backgroundColor: '#fff',
            shadowRadius: 10,
            shadowColor: 'rgba(0,0,0,0.25)',
            shadowOffset: { width: 0, height: 6 },
            zIndex: 10000,
          })}
        >
          {children}
        </VStack>
      </VStack>
    </>
  )
}
