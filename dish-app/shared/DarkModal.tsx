import { AbsoluteVStack, AnimatedVStack, VStack } from '@dish/ui'
import { default as React } from 'react'
import { ScrollView } from 'react-native'

import { brandColor } from './colors'

export const DarkModal = ({
  hide,
  children,
  outside,
}: {
  hide: boolean
  children: any
  outside?: any
}) => {
  return (
    <AbsoluteVStack
      className="inset-shadow-xxxl ease-in-out-slow"
      fullscreen
      zIndex={10000000000}
      alignItems="center"
      justifyContent="center"
      paddingHorizontal="4vw"
      paddingVertical="1vh"
      backgroundColor="rgba(50,20,40,0.8)"
      opacity={hide ? 0 : 1}
      pointerEvents={hide ? 'none' : 'auto'}
      transform={[{ translateY: 0 }]}
    >
      <AnimatedVStack
        maxWidth={450}
        maxHeight={680}
        width="99%"
        height="99%"
        animateState={hide ? 'out' : 'in'}
      >
        <VStack
          width="100%"
          height="100%"
          borderWidth={1}
          borderColor={`${brandColor}55`}
          position="relative"
          backgroundColor="#000"
          borderRadius={25}
          shadowColor="rgba(0,0,0,1)"
          shadowRadius={150}
          shadowOffset={{ height: 10, width: 0 }}
        >
          {outside}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              maxWidth: '100%',
              maxHeight: 630,
            }}
          >
            <VStack flex={1} paddingTop={20} alignItems="center">
              {children}
            </VStack>
          </ScrollView>
        </VStack>
      </AnimatedVStack>
    </AbsoluteVStack>
  )
}
