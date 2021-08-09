import { MapPosition, slugify } from '@dish/graph'
import { useStore, useStoreInstance } from '@dish/use-store'
import React, { Suspense, memo, useEffect, useMemo, useState } from 'react'
import {
  AbsoluteVStack,
  AnimatedVStack,
  HStack,
  LoadingItems,
  Modal,
  Paragraph,
  Spacer,
  Text,
  Theme,
  VStack,
  useMedia,
  useTheme,
  useThemeName,
} from 'snackui'

import { drawerWidthMax, searchBarHeight } from '../../constants/constants'
import {
  getDefaultLocation,
  initialPosition,
  setDefaultLocation,
} from '../../constants/initialHomeState'
import { useRegionQuery } from '../../helpers/fetchRegion'
import { getColorsForName } from '../../helpers/getColorsForName'
import { queryClient } from '../../helpers/queryClient'
import { router } from '../../router'
import { HomeStateItemHome } from '../../types/homeTypes'
import { appMapStore, cancelUpdateRegion, useSetAppMap } from '../AppMapStore'
import { autocompletesStore } from '../AutocompletesStore'
import { homeStore, useHomeStateById } from '../homeStore'
import { useLastValueWhen } from '../hooks/useLastValueWhen'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import { setInitialRegionSlug } from '../initialRegionSlug'
import { IntroModalStore } from '../IntroModalStore'
import { PortalItem } from '../Portal'
import { CloseButton } from '../views/CloseButton'
import { ContentScrollView } from '../views/ContentScrollView'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { Link } from '../views/Link'
import { PageHead } from '../views/PageHead'
import { PaneControlButtons } from '../views/PaneControlButtons'
import { SlantedTitle } from '../views/SlantedTitle'
import { HomePageFeed } from './HomePageFeed'
import { homePageStore } from './homePageStore'
import { HomeStackViewProps } from './HomeStackViewProps'
import { HomeTopSearches } from './HomeTopSearches'
import { PageContentWithFooter } from './PageContentWithFooter'

type Props = HomeStackViewProps<HomeStateItemHome>

export default memo(function HomePage(props: Props) {
  const [didLoadOnce, setDidLoadOnce] = useState(false)

  useEffect(() => {
    if (props.isActive) {
      setDidLoadOnce(true)
    }
  }, [props.isActive])

  return useLastValueWhen(() => {
    if (!didLoadOnce) {
      return <LoadingItems />
    }
    return (
      <Suspense fallback={<LoadingItems />}>
        <HomePageContent {...props} />
      </Suspense>
    )
  }, !props.isActive)
})

// happens once on first load
let hasMovedToInitialRegion = false

const HomePageContent = (props: Props) => {
  const { isActive, item } = props
  const state = useHomeStateById<HomeStateItemHome>(item.id)
  const theme = useTheme()
  const enabled = isActive && !!state.region
  const regionResponse = useRegionQuery(state.region, {
    enabled,
    suspense: true,
  })
  const [position, setPosition] = useState<MapPosition>(initialPosition)
  const regionColors = getColorsForName(state.region)
  const region = regionResponse.data
  const { results } = useStoreInstance(homePageStore)

  useSetAppMap({
    isActive: props.isActive,
    results,
    center: state.center,
    span: state.span,
  })

  useEffect(() => {
    if (!isActive) return
    if (!region || !region.center || !region.span) return
    setInitialRegionSlug(item.region)
    cancelUpdateRegion()
    setPosition(region)
    homeStore.updateCurrentState('HomePage.curLoc', {
      curLocName: region.name,
    })
  }, [isActive, JSON.stringify([region])])

  useEffect(() => {
    return () => {
      queryClient.cancelQueries(state.region)
    }
  }, [state.region])

  // move initially to url region - this seems non-ideal state should just drive map
  useEffect(() => {
    if (!region) return
    if (!hasMovedToInitialRegion) {
      hasMovedToInitialRegion = true
      appMapStore.setPosition({
        center: region.center,
        span: region.span,
      })
    }
  }, [position])

  // set location for next reload + move map on initial load
  useEffect(() => {
    if (!isActive) return
    if (regionResponse.status !== 'success') return
    if (!region) return
    const next = region.slug ?? slugify(region.name)
    const prev = getDefaultLocation().region
    if (next !== prev) {
      setDefaultLocation({
        center: region.center,
        span: region.span,
        region: next,
      })
    }
  }, [isActive, position])

  // if no region, nav to default one
  useEffect(() => {
    if (isActive && !state.region) {
      // no region found!
      console.warn('no region, nav', region)
      router.navigate({
        name: 'homeRegion',
        params: {
          region: getDefaultLocation().region ?? 'ca-san-francisco',
        },
      })
    }
  }, [isActive, state.region])

  const regionName = region?.name || state.curLocName || '...'
  const media = useMedia()

  // if (process.env.NODE_ENV === 'development') {
  //   // prettier-ignore
  //   console.log('👀 HomePage', { enabled, regionResponse, position, item, region, state, isActive })
  // }

  const homeHeaderContent = useMemo(() => {
    return (
      <>
        <HomeTopSpacer />
        <Spacer size="md" {...(media.sm && { size: 4 })} />
        <HStack marginVertical={-16}>
          <ContentScrollViewHorizontal>
            <HStack alignItems="center" paddingVertical={media.sm ? 10 : 15} paddingHorizontal={10}>
              <Link onPress={() => autocompletesStore.setTarget('location')}>
                <SlantedTitle
                  // borderBottomColor={regionColors.color}
                  // borderBottomWidth={2}
                  // backgroundColor={theme.backgroundColor}
                  // color={regionColors.color}
                  backgroundColor={regionColors.color}
                  color="#fff"
                  minWidth={100}
                  fontWeight="900"
                  size={
                    regionName.length > 24
                      ? 'xxs'
                      : regionName.length > 17
                      ? 'xs'
                      : regionName.length > 14
                      ? 'sm'
                      : regionName.length > 8
                      ? 'md'
                      : 'lg'
                  }
                >
                  {regionName}
                </SlantedTitle>
              </Link>
              <HomeTopSearches />
            </HStack>
          </ContentScrollViewHorizontal>
        </HStack>
        <Spacer size="md" />
      </>
    )
  }, [regionColors.color, regionName])

  return (
    <>
      <PageHead>Dish - Uniquely Great Food</PageHead>

      <HomePageWelcomeBubble />

      {/* TOP FADE */}
      <AbsoluteVStack
        top={-searchBarHeight + 4}
        right={0}
        left={0}
        overflow="hidden"
        height={searchBarHeight}
        zIndex={10}
        opacity={isActive ? 1 : 0}
        pointerEvents="none"
      >
        <AbsoluteVStack
          bottom={10}
          left={0}
          right={0}
          shadowColor={theme.backgroundColor}
          shadowOpacity={1}
          shadowRadius={10}
          height={searchBarHeight + 10}
        />
      </AbsoluteVStack>

      <VStack
        flex={1}
        width="100%"
        maxHeight="100%"
        overflow="hidden"
        maxWidth={drawerWidthMax}
        alignSelf="flex-end"
      >
        <ContentScrollView id="home">
          {homeHeaderContent}

          <PageContentWithFooter>
            <HomePageFeed item={state} regionName={regionName} region={region} {...position} />
          </PageContentWithFooter>
        </ContentScrollView>
      </VStack>
    </>
  )
}

const HomePageWelcomeBubble = memo(() => {
  return (
    <PortalItem id="root">
      <Theme name="dark">
        <Inner />
      </Theme>
    </PortalItem>
  )
})

const Inner = () => {
  const introStore = useStore(IntroModalStore)
  const [show, setShow] = useLocalStorageState('home-intro-dialogue', true)
  const theme = useTheme()

  if (!show || !introStore.hidden) {
    return null
  }

  return (
    <AbsoluteVStack zIndex={100000000} fullscreen alignItems="flex-end" justifyContent="flex-end">
      <AnimatedVStack>
        <VStack
          backgroundColor={theme.backgroundColor}
          borderColor={theme.borderColor}
          borderWidth={1}
          borderRadius={15}
          margin={10}
          marginHorizontal={15}
          position="relative"
          maxWidth={600}
          pointerEvents="auto"
          elevation={1}
        >
          <PaneControlButtons>
            <CloseButton onPress={() => setShow(false)} />
          </PaneControlButtons>
          <VStack paddingVertical={20} paddingHorizontal={20}>
            <Paragraph size="md" sizeLineHeight={0.9}>
              <Text fontWeight="800">A better pocket guide for the world.</Text> Find great
              playlists for the real world, earn money curating and reviewing.{' '}
              <Link name="about" fontWeight="600">
                Learn more
              </Link>
            </Paragraph>
          </VStack>
        </VStack>
      </AnimatedVStack>
    </AbsoluteVStack>
  )
}

const HomeTopSpacer = () => {
  const media = useMedia()
  return <VStack pointerEvents="none" marginTop={5} height={media.sm ? 0 : searchBarHeight} />
}
