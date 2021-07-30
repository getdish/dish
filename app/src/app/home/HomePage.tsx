import { MapPosition, slugify } from '@dish/graph'
import { useStore, useStoreInstance } from '@dish/use-store'
import React, { Suspense, memo, useEffect, useMemo, useState } from 'react'
import {
  AbsoluteVStack,
  HStack,
  LoadingItems,
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
import { useHomeStateById } from '../homeStore'
import { useLastValueWhen } from '../hooks/useLastValueWhen'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import { setInitialRegionSlug } from '../initialRegionSlug'
import { CloseButton } from '../views/CloseButton'
import { ContentScrollView } from '../views/ContentScrollView'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { Link } from '../views/Link'
import { PageTitleTag } from '../views/PageTitleTag'
import { SlantedTitle } from '../views/SlantedTitle'
import { HomePageFeed } from './HomePageFeed'
import { homePageStore } from './homePageStore'
import { HomeStackViewProps } from './HomeStackViewProps'
import { HomeTopSearches } from './HomeTopSearches'
import { PageContentWithFooter } from './PageContentWithFooter'

type Props = HomeStackViewProps<HomeStateItemHome>

export default memo(function HomePage(props: Props) {
  const [didLoadOnce, setDidLoadOnce] = useState(false)
  const { results } = useStoreInstance(homePageStore)

  useSetAppMap({
    isActive: props.isActive,
    results,
    center: props.item.center,
    span: props.item.span,
  })

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
  const regionResponse = useRegionQuery(state.region, {
    enabled: isActive && !!state.region,
    suspense: true,
  })
  const [position, setPosition] = useState<MapPosition>(initialPosition)
  const regionColors = getColorsForName(state.region)
  const region = regionResponse.data

  if (process.env.NODE_ENV === 'development') {
    // prettier-ignore
    console.log('👀 HomePage', state.region, { position, item: item, region, state, isActive: isActive })
  }

  useEffect(() => {
    if (!region) return
    setInitialRegionSlug(item.region)
  }, [region])

  // center map to region
  useEffect(() => {
    if (!isActive) return
    if (!region || !region.center || !region.span) return
    cancelUpdateRegion()
    setPosition(region)
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

  const homeHeaderContent = useMemo(() => {
    return (
      <>
        <HomeTopSpacer />
        <Spacer size="md" {...(media.sm && { size: 4 })} />
        <HStack marginVertical={-16}>
          <ContentScrollViewHorizontal>
            <HStack
              alignItems="center"
              paddingVertical={media.sm ? 10 : 20}
              paddingBottom={media.sm ? 10 : 15}
              paddingHorizontal={10}
            >
              <Theme name="dark">
                <Link onPress={() => autocompletesStore.setTarget('location')}>
                  <SlantedTitle
                    backgroundColor={theme.backgroundColor}
                    borderBottomColor={regionColors.color}
                    borderBottomWidth={2}
                    color={regionColors.color}
                    minWidth={100}
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
              </Theme>
              <HomeTopSearches />
            </HStack>
          </ContentScrollViewHorizontal>
        </HStack>
        <Spacer size="lg" />
        <HomePageIntroDialogue />
      </>
    )
  }, [regionColors.color, regionName])

  return (
    <>
      <PageTitleTag>Dish - Uniquely Great Food</PageTitleTag>

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

const useThemeColor = (name: string) => {
  const themeName = useThemeName()
  return `${name}${themeName === 'dark' ? '-dark' : ''}`
}

const HomePageIntroDialogue = memo(() => {
  const themeColor = useThemeColor('yellow')
  return (
    <Theme name={themeColor}>
      <Inner />
    </Theme>
  )
})

const Inner = () => {
  const [show, setShow] = useLocalStorageState('home-intro-dialogue', true)
  const theme = useTheme()

  if (!show) {
    return null
  }

  return (
    <VStack
      backgroundColor={theme.backgroundColor}
      borderColor={theme.borderColor}
      borderWidth={1}
      borderRadius={15}
      paddingVertical={20}
      paddingHorizontal={13}
      margin={10}
      marginHorizontal={15}
      position="relative"
      maxWidth={740}
      alignSelf="center"
    >
      <AbsoluteVStack top={-20} right={-20}>
        <CloseButton onPress={() => setShow(false)} />
      </AbsoluteVStack>
      <Paragraph>
        <Text fontWeight="700">Dish is a pocket map of the world powered by community.</Text> We
        want to make it easier to know what's uniquely good in each city and neighborhood.{' '}
        <Link name="about">Read more</Link>.
      </Paragraph>
    </VStack>
  )
}

const HomeTopSpacer = () => {
  const media = useMedia()
  return <VStack pointerEvents="none" marginTop={5} height={media.sm ? 0 : searchBarHeight} />
}
