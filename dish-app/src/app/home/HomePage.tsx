import { MapPosition, slugify } from '@dish/graph'
import React, { Suspense, memo, useEffect, useState } from 'react'
import {
  AbsoluteVStack,
  HStack,
  LoadingItems,
  Paragraph,
  Spacer,
  Text,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'

import { allExtraLightColors, allLightColors } from '../../constants/colors'
import { drawerWidthMax, searchBarHeight } from '../../constants/constants'
import {
  getDefaultLocation,
  initialPosition,
  setDefaultLocation,
} from '../../constants/initialHomeState'
import { useRegionQuery } from '../../helpers/fetchRegion'
import { getColorsForName } from '../../helpers/getColorsForName'
import { queryClient } from '../../helpers/queryClient'
import { router, useIsRouteActive } from '../../router'
import { HomeStateItemHome } from '../../types/homeTypes'
import { cancelUpdateRegion } from '../AppMapStore'
import { useHomeStore } from '../homeStore'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import { CloseButton } from '../views/CloseButton'
import { ContentScrollView } from '../views/ContentScrollView'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { Link } from '../views/Link'
import { PageTitleTag } from '../views/PageTitleTag'
import { SlantedTitle } from '../views/SlantedTitle'
import { HomePageFeed } from './HomePageFeed'
import { HomeStackViewProps } from './HomeStackViewProps'
import { HomeTopSearches } from './HomeTopSearches'
import { PageContentWithFooter } from './PageContentWithFooter'
import { PageFooter } from './PageFooter'

export default memo(function HomePage(
  props: HomeStackViewProps<HomeStateItemHome>
) {
  const home = useHomeStore()
  const theme = useTheme()
  const [isLoaded, setIsLoaded] = useState(false)
  const state = home.lastHomeState
  const isRouteActive = useIsRouteActive('home', 'homeRegion')
  // first one is if the route is active, second is if the stack view active
  const isActive = isRouteActive && props.isActive
  const regionResponse = useRegionQuery(state.region, {
    enabled: props.isActive && !!state.region,
    suspense: false,
  })
  const [position, setPosition] = useState<MapPosition>(initialPosition)
  const regionColors = getColorsForName(props.item.region)
  // const navLinks: LinkButtonProps[] = [
  //   {
  //     name: 'homeRegion',
  //     params: { region: state.region, section: '' },
  //     children: 'Hot',
  //   },
  //   {
  //     name: 'homeRegion',
  //     params: { region: state.region, section: 'new' },
  //     children: 'New',
  //   },
  // ]
  const region = regionResponse.data
  const { center, span } = region ?? {}

  // prettier-ignore
  console.log('👀 HomePage', state.region, { position, isLoaded, props, region, state, isActive, center, span })

  // on load home clear search effect!
  useEffect(() => {
    // not on first load
    if (isActive && isLoaded) {
      home.clearSearch()
      home.clearTags()
    }
  }, [isActive, isLoaded])

  // center map to region
  useEffect(() => {
    if (!isActive) return
    if (!region || !center || !span) return
    if (region.slug !== state.region) return
    cancelUpdateRegion()
    setPosition({ center, span })
    setIsLoaded(true)
  }, [isActive, isLoaded, JSON.stringify([center, span])])

  useEffect(() => {
    return () => {
      queryClient.cancelQueries(state.region)
    }
  }, [state.region])

  useEffect(() => {
    if (!isActive) return
    if (regionResponse.status !== 'success') return
    if (region) {
      const regionSlug = region.slug ?? slugify(region.name)
      setDefaultLocation({
        center: region.center,
        span: region.span,
        region: regionSlug,
      })
    }
  }, [isActive, regionResponse.status, region?.slug])

  useEffect(() => {
    if (isActive && !props.item.region) {
      // no region found!
      console.warn('no region, nav', region)
      router.navigate({
        name: 'homeRegion',
        params: {
          region: getDefaultLocation().region ?? 'ca-san-francisco',
        },
      })
    }
  }, [isActive, props.item.region])

  const regionName = region?.name ?? '...'

  return (
    <>
      <PageTitleTag>Dish - Uniquely Good Food</PageTitleTag>

      {/* TOP FADE */}
      <AbsoluteVStack
        top={-searchBarHeight + 11}
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
          <VStack flex={1} overflow="hidden" maxWidth="100%">
            <VStack>
              <HomeTopSpacer />

              <Spacer size="md" />

              <HStack marginBottom={-20}>
                <ContentScrollViewHorizontal>
                  <HStack
                    alignItems="center"
                    paddingVertical={12}
                    paddingBottom={25}
                    paddingHorizontal={10}
                  >
                    <VStack position="relative">
                      <SlantedTitle
                        minWidth={100}
                        backgroundColor={regionColors.color}
                        color="#fff"
                        size={
                          regionName.length > 24
                            ? 'xs'
                            : regionName.length > 17
                            ? 'sm'
                            : regionName.length > 14
                            ? 'md'
                            : regionName.length > 8
                            ? 'lg'
                            : 'xl'
                        }
                      >
                        {regionName}
                      </SlantedTitle>
                    </VStack>
                    <HomeTopSearches />
                  </HStack>
                </ContentScrollViewHorizontal>
              </HStack>

              <Spacer size="lg" />

              <HomePageIntroDialogue />

              <PageContentWithFooter>
                {isLoaded && (
                  <HomePageFeed
                    key={state.region}
                    {...props}
                    region={region}
                    {...position}
                  />
                )}
              </PageContentWithFooter>
            </VStack>
          </VStack>
        </ContentScrollView>
      </VStack>
    </>
  )
})

const HomePageIntroDialogue = memo(() => {
  const [show, setShow] = useLocalStorageState('home-intro-dialogue', true)

  if (!show) {
    return null
  }

  return (
    <VStack
      backgroundColor={allExtraLightColors[0]}
      borderColor={allLightColors[0]}
      borderWidth={1}
      borderRadius={15}
      padding={10}
      paddingHorizontal={13}
      margin={10}
      position="relative"
      maxWidth={740}
      alignSelf="center"
    >
      <AbsoluteVStack top={-10} right={-10}>
        <CloseButton onPress={() => setShow(false)} />
      </AbsoluteVStack>
      <Paragraph>
        <Text fontWeight="700">Welcome!</Text> Dish is a better pocket map of
        the world, starting with food. We want to make it easier to know what's
        uniquely good in each city and neighborhood.{' '}
        <Link name="about">Read more</Link>.
      </Paragraph>
    </VStack>
  )
})

const HomeTopSpacer = () => {
  const media = useMedia()
  return (
    <VStack
      pointerEvents="none"
      marginTop={5}
      height={media.sm ? 0 : searchBarHeight}
    />
  )
}
