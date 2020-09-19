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
        shadowRadius={10}
        shadowOffset={{ width: 0, height: 3 }}
        shadowColor="rgba(0,0,0,0.15)"
        backgroundColor="#111"
        {...(isHovered && {
          zIndex: 10000,
          shadowRadius: 14,
          shadowColor: 'rgba(0,0,0,0.3)',
          shadowOffset: { width: 0, height: 5 },
        })}
        {...rest}
      >
        {/* frame (inner) */}
        <VStack
          shadowColor="rgba(0,0,0,0.25)"
          flex={1}
          borderRadius={borderRadius - (rest.borderWidth ?? 0)}
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
        >
          {children}
          <AbsoluteVStack fullscreen className="box-shadow-inset-large" />
        </VStack>
        {outside}
      </VStack>
    </>
  )
}
