import AppMap from './AppMap'
import AppMapContainer from './AppMapContainer'
import { AppMenuButtonFloating } from './AppMenuButtonFloating'
import { AutocompleteEffects } from './AutocompletesStore'
import { Route } from './Route'
import { Home } from './home/Home'
import GalleryPage from './home/gallery/GalleryPage'
import ListPage from './home/list/ListPage'
import RestaurantHoursPage from './home/restaurantHours/RestaurantHoursPage'
import RestaurantReviewPage from './home/restaurantReview/RestaurantReviewPage'
import { useCurrentUserQuery } from './hooks/useUserReview'
import { useQuery } from '@dish/graph'
import { H2, Square, Theme, XStack, YStack, ZStack, useTheme, useThemeName } from '@dish/ui'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
// import { StatusBar } from 'expo-status-bar'
import React, { Suspense, memo } from 'react'
import { LogBox, StatusBar, useWindowDimensions } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

LogBox.ignoreAllLogs(true)

export const App = memo(() => {
  const theme = useTheme()
  const windowDimensions = useWindowDimensions()
  const offset = useSharedValue({ x: 0 })
  const start = useSharedValue({ x: 0 })
  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value.x }],
    }
  })

  const snapPoints = [0, -windowDimensions.width]

  const gesture = Gesture.Pan()
    .onBegin(() => {
      // isPressed.value = true;
      // probably set start.value.x to current offset.value.x
    })
    .onUpdate((e) => {
      offset.value = {
        x: e.translationX + start.value.x,
      }
    })
    .onEnd((e) => {
      const vx = e.velocityX
      const endIndex = offset.value.x + vx
      const direction = vx < 0 ? 'left' : 'right'

      console.log('direction', direction)

      let closestSnapPoint = 0
      let distanceToLast = Infinity
      for (const point of snapPoints) {
        const dist = -Math.abs(Math.abs(endIndex) - Math.abs(point))
        console.log(point, 'dist', dist, point, endIndex)
        if (dist < distanceToLast) {
          distanceToLast = dist
          closestSnapPoint = point
        }
      }

      start.value = {
        x: closestSnapPoint,
      }

      console.log('closestSnapPoint', closestSnapPoint, vx)
      offset.value = {
        x: withSpring(closestSnapPoint),
      }
    })
    .onFinalize(() => {
      // isPressed.value = false;
    })

  return (
    <>
      <AppStatusBar />
      <AutocompleteEffects />

      {/* side swipe gestures */}
      <YStack zi={100000000000000} fullscreen pe="box-none">
        <GestureDetector gesture={gesture}>
          <XStack fullscreen pe="box-none">
            <YStack fullscreen left="auto" width={30} bc="rgba(0,0,0,0)" />
            <YStack fullscreen right="auto" width={30} bc="rgba(0,0,0,0)" />
          </XStack>
        </GestureDetector>
      </YStack>

      <Animated.View
        pointerEvents="box-none"
        style={[
          {
            width: '100%',
            height: '100%',
            flexDirection: 'row',
            backgroundColor: theme.background,
          },
          style,
        ]}
      >
        <XStack
          pe="box-none"
          w={windowDimensions.width}
          br="$10"
          shadowColor="#000"
          shadowRadius={10}
        >
          <XStack h="100%" w="100%" zi={1} pe="box-none" br="$10" ov="hidden">
            <BottomSheetModalProvider>
              <Suspense fallback={null}>
                <AppMapContainer>
                  <AppMap />
                </AppMapContainer>
              </Suspense>

              <Home />
            </BottomSheetModalProvider>
          </XStack>

          <Theme name="dark">
            <XStack zi={0} bc="$background" pe="box-none" w={windowDimensions.width}>
              <MyLists />
            </XStack>
          </Theme>
        </XStack>
      </Animated.View>

      <AppMenuButtonFloating />

      <Suspense fallback={null}>
        <GalleryPage />
        <RestaurantReviewPage />
        <Route name="restaurantHours">
          <RestaurantHoursPage />
        </Route>
      </Suspense>
      {/* </AbsoluteYStack> */}
    </>
  )
})

const MyLists = () => {
  const [user] = useCurrentUserQuery()

  return (
    <YStack py="$13" px="$3">
      {user.lists({ limit: 20 }).map((list) => {
        return (
          <H2 key={list.name} ff="$stylish">
            {list.name}
          </H2>
        )
      })}
    </YStack>
  )
}

const AppStatusBar = () => {
  const themeName = useThemeName()
  return <StatusBar barStyle={themeName === 'light' ? 'light-content' : 'dark-content'} />
}
