import React from 'react'
import {
  Modal as ModalNative,
  ModalProps,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'

import { isWeb } from '../constants'
import { prevent } from '../helpers/prevent'
import { AnimatedVStack } from './AnimatedStack'
import { AbsoluteVStack, StackProps, VStack } from './Stacks'

// TODO if we add `closableButton` prop we can control exit animation nicely

export const Modal = ({
  // modal specific props
  animated,
  animationType = 'slide',
  transparent = true,
  visible = true,
  onRequestClose,
  onShow,
  // ios specific
  presentationStyle,
  supportedOrientations,
  onDismiss,
  onOrientationChange,
  // android specific
  hardwareAccelerated,
  statusBarTranslucent,
  // overlay
  overlayBackground = 'rgba(0,0,0,0.5)',
  overlayDismisses,
  // children
  children,
  ...rest
}: ModalProps &
  StackProps & {
    overlayBackground?: string
    overlayDismisses?: boolean
  }) => {
  const modalProps = {
    animated,
    animationType,
    transparent,
    visible,
    onRequestClose,
    onShow,
    presentationStyle,
    supportedOrientations,
    onDismiss,
    onOrientationChange,
    hardwareAccelerated,
    statusBarTranslucent,
  }
  if (isWeb) {
    return (
      <ModalNative {...modalProps}>
        <AbsoluteVStack
          fullscreen
          backgroundColor={overlayBackground}
          alignItems="center"
          justifyContent="center"
          onPress={overlayDismisses ? onRequestClose : undefined}
        >
          <AnimatedVStack>
            <VStack
              backgroundColor="#fff"
              borderRadius={15}
              alignItems="center"
              position="relative"
              overflow="hidden"
              shadowColor="rgba(0,0,0,0.5)"
              shadowRadius={40}
              onPress={prevent}
              {...rest}
            >
              {children}
            </VStack>
          </AnimatedVStack>
        </AbsoluteVStack>
      </ModalNative>
    )
  }

  return (
    <ModalNative {...modalProps}>
      {/* fix for native: https://github.com/facebook/react-native/issues/26892 */}
      <TouchableOpacity
        activeOpacity={1}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        onPressOut={(e) => {
          if (e.nativeEvent?.locationY) {
            onRequestClose?.()
          }
        }}
      >
        <VStack flex={1} {...rest} backgroundColor="green">
          {children}
        </VStack>
      </TouchableOpacity>
    </ModalNative>
  )
}
