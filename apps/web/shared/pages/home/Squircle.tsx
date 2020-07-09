import { AbsoluteVStack, LinearGradient, StackProps, VStack } from '@dish/ui'
import React from 'react'
import { StyleSheet } from 'react-native'

export const Squircle = ({
  width = 100,
  height = 100,
  borderRadius = 20,
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
        {...rest}
      >
        {/* frame (inner) */}
        <VStack
          className="ease-in-out-fast"
          shadowColor="rgba(0,0,0,0.4)"
          shadowRadius={4}
          shadowOffset={{ width: 0, height: 3 }}
          flex={1}
          borderRadius={borderRadius}
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
          {...(isHovered && {
            borderColor: 'rgba(0,0,0,0.75)',
            backgroundColor: '#fff',
            shadowRadius: 10,
            shadowColor: 'rgba(0,0,0,0.25)',
            shadowOffset: { width: 0, height: 6 },
            zIndex: 10000,
          })}
        >
          <AbsoluteVStack
            className={
              // isHovered ? 'ease-in-out inner-glow' :
              'ease-in-out inner-shadow'
            }
            borderRadius={borderRadius}
            overflow="hidden"
            fullscreen
            zIndex={2}
          >
            <LinearGradient
              colors={[
                'rgba(255,255,255,0.45)',
                'rgba(255,255,255,0)',
                'rgba(255,255,255,0)',
                'rgba(0,0,0,0)',
                'rgba(30,30,30,0.123)',
              ]}
              style={[StyleSheet.absoluteFill]}
            />
          </AbsoluteVStack>
          {children}
        </VStack>
      </VStack>
    </>
  )
}
