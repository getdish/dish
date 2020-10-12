import { AbsoluteVStack, AnimatedVStack, VStack } from '@dish/ui'
import { default as React } from 'react'
import { ScrollView } from 'react-native'

import { brandColor } from './colors'
import { useIsNarrow } from './hooks/useIs'

export const DarkModal = ({
  hide,
  children,
  outside,
}: {
  hide: boolean
  children: any
  outside?: any
}) => {
  const isSmall = useIsNarrow()
  return (
    <AbsoluteVStack
      className="inset-shadow-xxxl ease-in-out-slow"
      fullscreen
      zIndex={10000000000}
      alignItems="center"
      justifyContent="center"
      paddingHorizontal={isSmall ? 0 : '2%'}
      paddingVertical={isSmall ? 0 : '2%'}
      backgroundColor="rgba(60,30,50,0.9)"
      opacity={hide ? 0 : 1}
      pointerEvents={hide ? 'none' : 'auto'}
      transform={[{ translateY: 0 }]}
    >
      <AnimatedVStack
        maxWidth={450}
        maxHeight={680}
        width="100%"
        height="100%"
        animateState={hide ? 'out' : 'in'}
      >
        <VStack
          flex={1}
          margin={-8}
          borderWidth={1}
          borderColor={`${brandColor}88`}
          position="relative"
          backgroundColor="#000"
          borderRadius={12}
          shadowColor="rgba(0,0,0,1)"
          shadowRadius={150}
          shadowOffset={{ height: 10, width: 0 }}
        >
          {outside}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              maxWidth: '100%',
              minHeight: '100%',
            }}
          >
            <VStack
              flex={1}
              paddingVertical={20}
              paddingHorizontal={5}
              justifyContent="center"
              minHeight="100%"
              alignItems="center"
            >
              {children}
            </VStack>
          </ScrollView>
        </VStack>
      </AnimatedVStack>
    </AbsoluteVStack>
  )
}
