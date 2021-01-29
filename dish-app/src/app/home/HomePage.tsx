import { MapPosition, slugify } from '@dish/graph'
import React, { Suspense, memo, useEffect, useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  InteractiveContainer,
  LoadingItems,
  Spacer,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'

import { drawerWidthMax, searchBarHeight } from '../../constants/constants'
import {
  getDefaultLocation,
  initialPosition,
  setDefaultLocation,
} from '../../constants/initialHomeState'
import { useRegionQuery } from '../../helpers/fetchRegion'
import { getColorsForName } from '../../helpers/getColorsForName'
import { getGroupedButtonProps } from '../../helpers/getGroupedButtonProps'
import { queryClient } from '../../helpers/queryClient'
import { router, useIsRouteActive } from '../../router'
import { HomeStateItemHome } from '../../types/homeTypes'
import { cancelUpdateRegion } from '../AppMapStore'
import { useHomeStore } from '../homeStore'
import { ContentScrollView } from '../views/ContentScrollView'
import { DishHorizonView } from '../views/DishHorizonView'
import { LinkButton } from '../views/LinkButton'
import { LinkButtonProps } from '../views/LinkProps'
import { PageTitleTag } from '../views/PageTitleTag'
import { SlantedTitle } from '../views/SlantedTitle'
import { HomePageFeed } from './HomePageFeed'
import { HomeStackViewProps } from './HomeStackViewProps'
import { HomeTopSearches } from './HomeTopSearches'

export default memo(function HomePage(
  props: HomeStackViewProps<HomeStateItemHome>
) {
  const media = useMedia()
  const home = useHomeStore()
  const theme = useTheme()
  const isLoaded = useRef(false)
  const state = home.lastHomeState
  const isRouteActive = useIsRouteActive('home', 'homeRegion')
  // first one is if the route is active, second is if the stack view active
  const isActive = isRouteActive && props.isActive
  const region = useRegionQuery(state.region, {
    enabled: props.isActive && !!state.region,
    suspense: false,
  })
  const [position, setPosition] = useState<MapPosition>(initialPosition)
  const regionColors = getColorsForName(region.data?.name ?? '')
  const navLinks: LinkButtonProps[] = [
    {
      name: 'homeRegion',
      params: { region: state.region, section: '' },
      children: 'Hot',
    },
    {
      name: 'homeRegion',
      params: { region: state.region, section: 'new' },
      children: 'New',
    },
  ]

  console.log('👀 HomePage', state.region, { props, region, state, isActive })

  // on load home clear search effect!
  useEffect(() => {
    // not on first load
    if (isActive && isLoaded.current) {
      home.clearSearch()
      home.clearTags()
    }
  }, [isActive, isLoaded.current])

  // center map to region
  const { center, span } = region.data ?? {}
  useEffect(() => {
    if (!isActive) return
    if (!region.data || !center || !span) return
    if (slugify(region.data.name) !== state.region) return
    cancelUpdateRegion()
    setPosition({ center, span })
    isLoaded.current = true
  }, [isActive, isLoaded.current, JSON.stringify([center, span])])

  useEffect(() => {
    return () => {
      queryClient.cancelQueries(state.region)
    }
  }, [state.region])

  useEffect(() => {
    if (!isActive) return
    if (region.status !== 'success') return
    if (region.data) {
      const regionSlug = region.data.slug ?? slugify(region.data.name)
      setDefaultLocation({
        center: region.data.center,
        span: region.data.span,
        region: regionSlug,
      })
    }
  }, [isActive, region.status, region.data?.slug])

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
          borderBottomColor={theme.backgroundColorSecondary}
          borderBottomWidth={1}
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
          <AbsoluteVStack
            opacity={media.sm ? 0 : 0.05}
            top={0}
            right={0}
            left={0}
            height={700}
          >
            <DishHorizonView />
          </AbsoluteVStack>
          <VStack flex={1} overflow="hidden" maxWidth="100%">
            <VStack>
              <HomeTopSpacer />

              <Spacer size="md" />

              <HStack marginBottom={-20}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <HStack
                    alignItems="center"
                    paddingVertical={12}
                    paddingBottom={40}
                    paddingHorizontal={10}
                  >
                    <VStack position="relative">
                      <SlantedTitle
                        minWidth={80}
                        backgroundColor={regionColors.color}
                        color="#fff"
                        marginTop={-20}
                      >
                        {region.data?.name ?? ''}
                      </SlantedTitle>

                      <AbsoluteVStack
                        bottom={-39}
                        right={0}
                        transform={[{ rotate: '-2deg' }]}
                      >
                        <InteractiveContainer borderRadius={14}>
                          {navLinks.map((linkProps, index) => {
                            const isActive =
                              state.section === linkProps.params.section
                            return (
                              <LinkButton
                                key={index}
                                textProps={{
                                  color: isActive ? 'red' : '#888',
                                  fontWeight: '500',
                                }}
                                {...getGroupedButtonProps({
                                  index,
                                  items: navLinks,
                                  borderRadius: 10,
                                })}
                                {...linkProps}
                              />
                            )
                          })}
                        </InteractiveContainer>
                      </AbsoluteVStack>
                    </VStack>
                    <HomeTopSearches />
                  </HStack>
                </ScrollView>
              </HStack>

              <Spacer size="lg" />

              <Spacer />
              <Suspense
                fallback={
                  <>
                    <LoadingItems />
                    <LoadingItems />
                  </>
                }
              >
                <HomePageFeed {...props} region={region.data} {...position} />
              </Suspense>
            </VStack>
          </VStack>
        </ContentScrollView>
      </VStack>
    </>
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
