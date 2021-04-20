import { series, sleep } from '@dish/async'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { AbsoluteVStack, AnimatedVStack, Theme, VStack, prevent, useMedia } from 'snackui'

export const DarkModal = ({
  hide,
  children,
  outside,
  onDismiss,
}: {
  hide?: boolean
  children: any
  outside?: any
  onDismiss?: any
}) => {
  const media = useMedia()
  const [fullHide, setFullHide] = useState(hide)

  useLayoutEffect(() => {
    if (!hide) {
      setFullHide(false)
      return
    }
    return series([() => sleep(400), () => setFullHide(true)])
  }, [hide])

  return (
    <Theme name="dark">
      <AbsoluteVStack
        className="dark inset-shadow-xxxl ease-in-out-slow"
        fullscreen
        zIndex={10000000000}
        alignItems="center"
        justifyContent="center"
        paddingHorizontal={media.sm ? 0 : '2%'}
        backgroundColor="rgba(30,0,12,0.5)"
        opacity={hide ? 0 : 1}
        display={fullHide ? 'none' : 'flex'}
        pointerEvents={hide ? 'none' : 'auto'}
        onPress={onDismiss}
      >
        <VStack flex={1} />
        <AnimatedVStack
          maxWidth={450}
          maxHeight="80%"
          width="100%"
          animateState={hide ? 'out' : 'in'}
        >
          <VStack
            flex={1}
            maxHeight="100%" // needed for chrome
            position="relative"
            backgroundColor="#000"
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
            shadowColor="rgba(0,0,0,1)"
            shadowRadius={150}
            shadowOffset={{ height: 10, width: 0 }}
            onPress={prevent}
          >
            {outside}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                maxWidth: '100%',
                minHeight: '100%',
              }}
            >
              <VStack flex={1} justifyContent="center" minHeight="100%" alignItems="center">
                {children}
              </VStack>
            </ScrollView>
          </VStack>
        </AnimatedVStack>
      </AbsoluteVStack>
    </Theme>
  )
}
