import { series, sleep } from '@dish/async'
import { AbsoluteYStack, AnimatedYStack, Theme, YStack, prevent, useMedia } from '@dish/ui'
import React, { useLayoutEffect, useState } from 'react'
import { ScrollView } from 'react-native'

export const DarkModal = ({
  hide,
  children,
  outside,
  onDismiss,
  fullscreen,
}: {
  hide?: boolean
  children: any
  outside?: any
  onDismiss?: any
  fullscreen?: boolean
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
      <AbsoluteYStack
        className="dark inset-shadow-xxxl ease-in-out-slow"
        fullscreen
        zIndex={10000000000}
        alignItems="center"
        justifyContent="center"
        backgroundColor="rgba(30,0,12,0.5)"
        opacity={hide ? 0 : 1}
        display={fullHide ? 'none' : 'flex'}
        pointerEvents={hide ? 'none' : 'auto'}
        onPress={onDismiss}
        {...(fullscreen && {
          paddingHorizontal: 0,
        })}
      >
        <YStack
          maxWidth={450}
          maxHeight="80%"
          width="100%"
          {...(fullscreen && {
            maxWidth: 'auto',
            maxHeight: 'auto',
            flex: 1,
            width: '100%',
            height: '100%',
          })}
          // animateState={hide ? 'out' : 'in'}
        >
          <YStack
            flex={1}
            maxHeight="100%" // needed for chrome
            position="relative"
            backgroundColor="#000"
            borderRadius={20}
            shadowColor="rgba(0,0,0,1)"
            shadowRadius={150}
            shadowOffset={{ height: 10, width: 0 }}
            onPress={prevent}
            {...(fullscreen && {
              borderRadius: 0,
            })}
          >
            {outside}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                maxWidth: '100%',
                minHeight: '100%',
              }}
            >
              <YStack flex={1} justifyContent="center" minHeight="100%" alignItems="center">
                {children}
              </YStack>
            </ScrollView>
          </YStack>
        </YStack>
      </AbsoluteYStack>
    </Theme>
  )
}
