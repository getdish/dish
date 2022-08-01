import { searchBarHeight } from '../constants/constants'
import { AppActionButton } from './AppActionButton'
import { AppMenuButton } from './AppMenuButton'
import { AppSearchInput } from './AppSearchInput'
import { UserMenuButton } from './UserMenuButton'
import { useUserStore } from './userStore'
import { DishLogoButton } from './views/DishLogoButton'
import { BlurView, Spacer, XStack, YStack, isWeb, useMedia, useTheme } from '@dish/ui'
import React, { Suspense, memo } from 'react'
import Squircle from 'react-native-squircle-skia'

export const AppSearchBarFloating = memo(() => {
  const media = useMedia()
  const userStore = useUserStore()
  const theme = useTheme()

  return (
    <XStack
      flex={1}
      pointerEvents="auto"
      alignItems="center"
      justifyContent="center"
      maxHeight={80}
      mb="$5"
      mx="$2"
    >
      <BlurView
        blurAmount={4}
        style={{
          zIndex: -1,
          width: '100%',
          height: 58,
          borderRadius: 22,
          transform: [{ translateY: 11 }],
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      <XStack
        br="$7"
        elevation="$1"
        shadowOpacity={0.5}
        pos="relative"
        flex={1}
        alignItems="center"
        justifyContent="center"
      >
        {isWeb ? (
          <YStack height={58} opacity={0.33} bc="$background" br={25} w="100%" />
        ) : (
          <Squircle
            smoothing={6}
            style={[
              {
                position: 'absolute',
                width: '100%',
                height: 58,
                opacity: 0.33,
                backgroundColor: theme.background.toString(),
                borderRadius: 25,
              },
            ]}
          />
        )}
        <YStack px="$2" maxHeight={searchBarHeight} overflow="hidden">
          <DishLogoButton />
        </YStack>

        <YStack f={10} className="ease-in-out" position="relative" alignItems="center">
          <AppSearchInput floating />
        </YStack>

        {media.gtSm && (
          <>
            <Spacer />

            {userStore.isLoggedIn && (
              <>
                <Suspense fallback={<Spacer size={32} />}>
                  <UserMenuButton />
                </Suspense>
              </>
            )}

            <AppActionButton />

            <Suspense fallback={null}>
              <AppMenuButton />
            </Suspense>
          </>
        )}
      </XStack>
    </XStack>
  )
})
