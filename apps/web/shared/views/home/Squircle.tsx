import { LinearGradient, StackProps, VStack, ZStack } from '@dish/ui'
import React from 'react'
import { StyleSheet } from 'react-native'

export const Squircle = ({
  width = 100,
  height = 100,
  borderRadius = 10,
  isHovered,
  children,
  ...rest
}: StackProps & {
  isHovered?: boolean
  size: number
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
          shadowColor="rgba(0,0,0,0.2)"
          shadowRadius={4}
          shadowOffset={{ width: 0, height: 4 }}
          flex={1}
          borderRadius={borderRadius}
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
          {...(isHovered && {
            borderColor: 'rgba(0,0,0,0.75)',
            backgroundColor: '#fff',
            shadowRadius: 13,
            shadowColor: 'rgba(0,0,0,0.1)',
            shadowOffset: { width: 0, height: 6 },
            zIndex: 10000,
          })}
        >
          <ZStack
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
          </ZStack>
          {children}
        </VStack>
      </VStack>
    </>
  )
}
