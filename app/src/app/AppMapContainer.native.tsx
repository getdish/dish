import { AppMapControls } from './AppMapControls'
import { AppMapHeader } from './AppMapHeader'
import { AppMapSpotlight } from './AppMapSpotlight'
import { appMapStore } from './appMapStore'
import { drawerStore } from './drawerStore'
import { Button, Spacer, XStack, YStack, useTheme } from '@dish/ui'
import { useStoreInstance } from '@dish/use-store'
import { Navigation } from '@tamagui/lucide-icons'
import React, { memo } from 'react'
import { Alert, SafeAreaView } from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'

export default memo(function AppMapContainer(props: { children: React.ReactNode }) {
  const drawer = useStoreInstance(drawerStore)
  const theme = useTheme()
  const y = useSharedValue(0)

  useAnimatedReaction(
    () => drawer.position,
    () => {
      'worklet'
      if (!drawer.position) return 0
      const next = Math.min(0, -300 + drawer.position.value / 2)
      y.value = next
    }
  )

  const mapFrameStyle = useAnimatedStyle(() => {
    'worklet'
    return { flex: 1, transform: [{ translateY: y.value }] }
  })

  return (
    <YStack bc={theme.background} fullscreen>
      <AppMapSpotlight />

      <YStack fullscreen>
        <Animated.View style={mapFrameStyle}>{props.children}</Animated.View>
      </YStack>

      {/* GPS */}
      <YStack pe="box-none" fullscreen bottom="auto" zIndex={10000000000}>
        <SafeAreaView pointerEvents="box-none">
          <XStack pe="box-none" px="$4">
            <AppMapControls />

            <AppMapHeader />

            <Spacer flex />

            <Button
              pointerEvents="auto"
              size="$5"
              circular
              elevate
              chromeless
              theme="dark"
              icon={Navigation}
              pressStyle={{
                bc: 'red',
              }}
              onPress={appMapStore.moveToUserLocation}
            />
          </XStack>
        </SafeAreaView>
      </YStack>
    </YStack>
  )
})
