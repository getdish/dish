import { drawerWidthMax, searchBarHeight } from '../../constants/constants'
import { getDefaultLocation, setDefaultLocation } from '../../constants/initialHomeState'
import { useRegionQuery } from '../../helpers/fetchRegion'
import { router } from '../../router'
import { HomeStateItemHome } from '../../types/homeTypes'
import { IntroModalStore } from '../IntroModalStore'
import { PortalItem } from '../Portal'
import { cancelUpdateRegion } from '../appMapStoreUpdateRegion'
import { homeStore, useHomeStateById } from '../homeStore'
import { useLastValueWhen } from '../hooks/useLastValueWhen'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import { setInitialRegionSlug } from '../initialRegionSlug'
import { CloseButton } from '../views/CloseButton'
import { ContentScrollView } from '../views/ContentScrollView'
import { Link } from '../views/Link'
import { PageHead } from '../views/PageHead'
import { PaneControlButtons } from '../views/PaneControlButtons'
import { HomePageFeed } from './HomePageFeed'
import { HomeStackViewProps } from './HomeStackViewProps'
import { PageContent } from './PageContent'
import { homePageStore } from './homePageStore'
import { series, sleep } from '@dish/async'
import { slugify } from '@dish/graph'
import {
  AbsoluteYStack,
  LoadingItems,
  Paragraph,
  Text,
  Theme,
  YStack,
  useMedia,
  useTheme,
} from '@dish/ui'
import { useStore, useStoreInstance } from '@dish/use-store'
import React, { Suspense, memo, useEffect } from 'react'

export type Props = HomeStackViewProps<HomeStateItemHome>

export default memo(function HomePage(props: Props) {
  const media = useMedia()
  return (
    <Suspense
      fallback={
        <YStack marginTop={media.sm ? 0 : searchBarHeight}>
          <LoadingItems />
        </YStack>
      }
    >
      <HomePageContent {...props} />
    </Suspense>
  )
})

// // happens once on first load
// let hasMovedToInitialRegion = false

const HomePageContent = (props: Props) => {
  const { isActive, item } = props
  const state = useHomeStateById<HomeStateItemHome>(item.id)
  const enabled = isActive && !!state.region
  // const regionResponse = useRegionQuery(state.region, {
  //   isPaused() {
  //     return !enabled
  //   },
  //   suspense: false,
  // })
  // const region = regionResponse.data
  // const [position, setPosition] = useState<MapPosition>(initialPosition)
  const { results } = useStoreInstance(homePageStore)

  useEffect(() => {
    return series([
      // initial load wait to zoom all the way in
      () => sleep(1500),
      () => {
        // homeStore.updateCurrentState('HomePage.curLoc', {
        //   curLocName: region.name,
        // })
        // move initially to url region - this seems non-ideal state should just drive map
        // if (!hasMovedToInitialRegion) {
        // hasMovedToInitialRegion = true
        homeStore.updateCurrentState('HomePage region initial move effect', {
          center: homeStore.currentState.center,
          span: {
            lng: 0.05,
            lat: 0.05,
          },
        })
      },
    ])
  }, [])

  // region based effects
  // useEffect(() => {
  //   if (!isActive) return
  //   if (!region || !region.center || !region.span) return
  //   setInitialRegionSlug(item.region)
  //   cancelUpdateRegion()

  //   return series([
  //     // initial load wait to zoom all the way in
  //     () => sleep(1000),
  //     () => {
  //       homeStore.updateCurrentState('HomePage.curLoc', {
  //         curLocName: region.name,
  //       })
  //       // move initially to url region - this seems non-ideal state should just drive map
  //       // if (!hasMovedToInitialRegion) {
  //       // hasMovedToInitialRegion = true
  //       homeStore.updateCurrentState('HomePage region initial move effect', {
  //         center: region.center,
  //         span: region.span,
  //       })
  //     },
  //   ])
  // }, [isActive, JSON.stringify([region])])

  // useEffect(() => {
  //   return () => {
  //     queryClient.cancelQueries(state.region)
  //   }
  // }, [state.region])

  // set location for next reload + move map on initial load
  // useEffect(() => {
  //   if (!isActive) return
  //   if (regionResponse.error) return
  //   if (!region) return
  //   const next = region.slug ?? slugify(region.name)
  //   const prev = getDefaultLocation().region
  //   if (next !== prev) {
  //     setDefaultLocation({
  //       center: region.center,
  //       span: region.span,
  //       region: next,
  //     })
  //   }
  // }, [isActive, region])

  // if no region, nav to default one
  // useEffect(() => {
  //   if (isActive && !state.region) {
  //     // no region found!
  //     console.warn('no region, nav', region)
  //     router.navigate({
  //       name: 'homeRegion',
  //       params: {
  //         region: getDefaultLocation().region ?? 'ca-san-francisco',
  //       },
  //     })
  //   }
  // }, [isActive, state.region])

  const wasEverActive = useLastValueWhen(() => props.isActive, !props.isActive)

  const homePageFeedProps = {
    id: props.item.id,
    isActive: props.isActive,
    fitToResults: false,
    results,
    center: state.center,
    span: state.span,
    region: state.region,
  }

  return (
    <>
      <PageHead isActive={props.isActive}>Dish - Uniquely Great Food</PageHead>

      <HomePageWelcomeBubble />

      <YStack maxWidth={drawerWidthMax}>
        <HomeTopSpacer />
        <PageContent hideFooter>
          {wasEverActive && <HomePageFeed {...homePageFeedProps} />}
        </PageContent>
      </YStack>
    </>
  )
}

const HomePageWelcomeBubble = memo(() => {
  const introStore = useStore(IntroModalStore)
  const [show, setShow] = useLocalStorageState('home-intro-dialogue', true)

  if (!show || !introStore.hidden) {
    return null
  }

  return (
    <PortalItem id="root">
      <Theme name="dark">
        <AbsoluteYStack
          pointerEvents="none"
          zIndex={100000000}
          fullscreen
          alignItems="flex-end"
          justifyContent="flex-end"
        >
          <YStack
            backgroundColor="$background"
            borderColor="$borderColor"
            borderWidth={1}
            borderRadius={15}
            margin={10}
            marginHorizontal={15}
            position="relative"
            maxWidth={600}
            pointerEvents="auto"
            elevation="$1"
          >
            <PaneControlButtons>
              <CloseButton onPress={() => setShow(false)} />
            </PaneControlButtons>
            <YStack paddingVertical={20} paddingHorizontal={20}>
              <Paragraph>
                <Text fontWeight="800">A better pocket guide to the world.</Text> Find and make
                playlists of the real world and earn money.{' '}
                <Link name="about" fontWeight="600">
                  Learn more
                </Link>
              </Paragraph>
            </YStack>
          </YStack>
        </AbsoluteYStack>
      </Theme>
    </PortalItem>
  )
})

const HomeTopSpacer = () => {
  const media = useMedia()
  return <YStack pointerEvents="none" height={media.sm ? 0 : searchBarHeight + 5} />
}
