import { slugify } from '@dish/graph'
import { capitalize } from 'lodash'
import React, { Suspense, memo, useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  InteractiveContainer,
  LoadingItems,
  Spacer,
  Theme,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'

import {
  drawerWidthMax,
  isWeb,
  searchBarHeight,
} from '../../constants/constants'
import { useRegionQuery } from '../../helpers/fetchRegion'
import { getColorsForName } from '../../helpers/getColorsForName'
import { setDefaultLocation } from '../../helpers/getDefaultLocation'
import { getGroupedButtonProps } from '../../helpers/getGroupedButtonProps'
import { router, useIsRouteActive } from '../../router'
import { HomeStateItemHome } from '../../types/homeTypes'
import { AppIntroLogin } from '../AppIntroLogin'
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

export type Props = HomeStackViewProps<HomeStateItemHome>

export default memo(function HomePage(props: Props) {
  const home = useHomeStore()
  const theme = useTheme()
  const [isLoaded, setIsLoaded] = useState(false)
  const state = home.lastHomeState
  const isRouteActive = useIsRouteActive('home')
  // first one is if the route is active, second is if the stack view active
  const isActive = isRouteActive && props.isActive
  const region = useRegionQuery(state.region, {
    enabled: props.isActive && !!state.region,
  })

  console.log('👀 HomePage', { props, region, state })

  // center map to region
  // ONLY on first load!
  useEffect(() => {
    if (!isActive) return
    if (!region.data) return
    if (isLoaded) return
    const { center, span } = region.data
    if (!center || !span) return
    home.updateCurrentState('HomePage.centerMapToRegion', {
      center,
      span,
    })
    setIsLoaded(true)
  }, [isActive, isLoaded, region.data])

  useEffect(() => {
    if (!isActive) return
    if (region.status !== 'success') return
    if (!region.data) {
      // no region found!
      router.navigate({
        name: 'homeRegion',
        params: {
          region: 'ca-san-francisco',
        },
      })
    } else {
      setDefaultLocation({
        center: region.data.center,
        span: region.data.span,
        region: slugify(region.data.name),
      })
    }
  }, [isActive, region.status, region.data])

  // on load home clear search effect!
  useEffect(() => {
    // not on first load
    if (isActive && isLoaded) {
      home.clearSearch()
      home.clearTags()
    }
  }, [isActive])

  const regionName = (() => {
    let next =
      (region.data?.name ?? '')
        .toLowerCase()
        .replace(/[a-z]{2}\- /i, '')
        .split(' ')
        .map((x) => capitalize(x))
        .join(' ') ?? ''
    if (next === '') return '...'
    return next
  })()

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

  const regionColors = getColorsForName(regionName)

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
            opacity={0.05}
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
                      >
                        {regionName}
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
                <HomePageFeed {...props} region={region.data} />
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

export const HomePageFooter = memo(() => {
  if (!isWeb) {
    return null
  }

  return (
    <Theme name="dark">
      <VStack position="relative">
        <AbsoluteVStack
          zIndex={-1}
          top={-15}
          left={-100}
          right={-100}
          bottom={-55}
          backgroundColor="#000"
          transform={[{ rotate: '-2deg' }]}
        />
        <VStack paddingVertical={20} alignItems="center" paddingHorizontal="5%">
          <VStack>
            <AppIntroLogin />
            <Spacer size="xxl" />
          </VStack>
        </VStack>
      </VStack>
    </Theme>
  )
})
