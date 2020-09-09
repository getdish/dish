import { AbsoluteVStack, StackProps, VStack } from '@dish/ui'
import React from 'react'

export const Squircle = ({
  width = 100,
  height = 100,
  borderRadius = 10,
  isHovered,
  children,
  outside,
  ...rest
}: StackProps & {
  isHovered?: boolean
  outside?: any
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
          shadowColor="rgba(0,0,0,0.25)"
          shadowRadius={6}
          shadowOffset={{ width: 0, height: 3 }}
          flex={1}
          borderRadius={borderRadius - (rest.borderWidth ?? 0)}
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
          {...(isHovered && {
            // borderColor: 'rgba(0,0,0,0.75)',
            backgroundColor: '#fff',
            shadowRadius: 14,
            shadowColor: 'rgba(0,0,0,0.3)',
            shadowOffset: { width: 0, height: 5 },
            zIndex: 10000,
          })}
        >
          {children}
          <AbsoluteVStack fullscreen className="box-shadow-inset-large" />
          {/* <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={[StyleSheet.absoluteFill]}
          /> */}
        </VStack>
        {outside}
      </VStack>
    </>
  )
}
