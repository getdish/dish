import { AppMapControls } from './AppMapControls'
import { AppMapHeader } from './AppMapHeader'
import { AppMapSpotlight } from './AppMapSpotlight'
import { appMapStore } from './appMapStore'
import { drawerStore } from './drawerStore'
import { Button, Spacer, XStack, YStack, useTheme } from '@dish/ui'
import { useStoreInstance } from '@dish/use-store'
import { Navigation } from '@tamagui/feather-icons'
import React, { memo } from 'react'
import { Alert, SafeAreaView } from 'react-native'

export default memo(function AppMapContainer(props: { children: React.ReactNode }) {
  const drawer = useStoreInstance(drawerStore)
  const theme = useTheme()
  const y = -300 + drawer.mapHeight / 2
  // const safeArea = useSafeAreaFrame

  return (
    <YStack bc={theme.background} fullscreen>
      <AppMapSpotlight />

      <YStack fullscreen y={y}>
        {props.children}
      </YStack>

      {/* GPS */}
      <YStack fullscreen bottom="auto" zIndex={10000000000}>
        <SafeAreaView>
          <XStack px="$4">
            {/* <AppMapControls /> */}

            <AppMapHeader />

            <Spacer flex />

            <Button
              pe="auto"
              size="$5"
              circular
              elevate
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
