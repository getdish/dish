import { graphql, query } from '@dish/graph'
// @ts-ignore
import React, { Suspense, memo, useState } from 'react'
import { Edit2 } from 'react-feather'
import { Image, ScrollView, Text, View } from 'react-native'

import { drawerBorderRadius } from '../../constants'
import { useDebounce } from '../../hooks/useDebounce'
import { useDebounceEffect } from '../../hooks/useDebounceEffect'
import { HomeStateItemSearch, isEditingUserPage } from '../../state/home'
import { getActiveTags } from '../../state/home-tag-helpers'
import { useOvermind } from '../../state/useOvermind'
import { NotFoundPage } from '../NotFoundPage'
import { Toast } from '../Toast'
import { Box } from '../ui/Box'
import { Circle } from '../ui/Circle'
import { Divider } from '../ui/Divider'
import { LinkButton } from '../ui/LinkButton'
import { PageTitle } from '../ui/PageTitle'
import { PageTitleTag } from '../ui/PageTitleTag'
import { closeAllPopovers, popoverCloseCbs } from '../ui/PopoverShared'
import { Spacer } from '../ui/Spacer'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import { useWaterfall } from '../ui/useWaterfall'
import { flatButtonStyle } from './baseButtonStyle'
import { DishView } from './DishView'
import { getTitleForState } from './getTitleForState'
import HomeLenseBar from './HomeLenseBar'
import { LoadingItems } from './LoadingItems'
import { RestaurantListItem } from './RestaurantListItem'

export const avatar = require('../../assets/peach.jpg').default

const verticalPad = 16

export default memo(function HomePageSearchResults({
  stateIndex,
}: {
  stateIndex: number
}) {
  const om = useOvermind()
  const state = om.state.home.states[stateIndex] as HomeStateItemSearch

  if (!state) {
    return <NotFoundPage />
  }

  const isEditingUserList = isEditingUserPage(om.state)
  const { title, subTitleElements, pageTitleElements } = getTitleForState(
    om.state,
    state
  )

  return (
    <VStack
      flex={1}
      zIndex={100}
      borderRadius={drawerBorderRadius}
      position="relative"
      backgroundColor="#fff"
    >
      <PageTitleTag>{title}</PageTitleTag>
      {/* <ZStack
        right={6}
        top={6}
        justifyContent="center"
        pointerEvents="auto"
        zIndex={100}
      >
        <HStack spacing="sm" alignItems="center">
          <CloseButton onPress={() => om.actions.home.up()} />
        </HStack>
      </ZStack> */}

      {/* Title */}
      <VStack paddingTop={verticalPad} paddingHorizontal={22}>
        <HStack width="100%">
          <VStack flex={4}>
            <PageTitle
              flex={2}
              subTitle={<HStack spacing={10}>{subTitleElements}</HStack>}
            >
              {pageTitleElements}
            </PageTitle>
          </VStack>

          <VStack alignItems="flex-end" justifyContent="center">
            <HomeLenseBar
              spacer={<Spacer size={9} />}
              relative
              stateIndex={stateIndex}
            />
          </VStack>
        </HStack>
        <Spacer size={verticalPad} />

        <ZStack
          fullscreen
          pointerEvents="none"
          top="auto"
          bottom={-30}
          right={-98}
          zIndex={1000}
          height={50}
          alignItems="flex-end"
        >
          <MyListButton isEditingUserList={isEditingUserList} />
        </ZStack>

        <Divider flex />
      </VStack>

      {/* CONTENT */}
      <VStack
        // marginTop={-23}
        position="relative"
        backgroundColor="rgba(255,255,255,1)"
        flex={1}
        overflow="hidden"
      >
        <HomeSearchResultsViewContent state={state} />
      </VStack>
    </VStack>
  )
})

const MyListButton = ({
  isEditingUserList,
}: {
  isEditingUserList: boolean
}) => {
  const om = useOvermind()
  return (
    <HStack alignItems="center" spacing="sm">
      <Circle size={26} marginVertical={-26 / 2}>
        <Image source={avatar} style={{ width: 26, height: 26 }} />
      </Circle>
      {isEditingUserList && (
        <>
          <LinkButton
            pointerEvents="auto"
            {...flatButtonStyle}
            {...{
              name: 'search',
              params: {
                ...om.state.router.curPage.params,
                username: '',
              },
            }}
            onPress={() => {
              Toast.show('Saved')
            }}
          >
            <Text>Done</Text>
          </LinkButton>
        </>
      )}
      {!isEditingUserList && (
        <LinkButton
          pointerEvents="auto"
          onPress={() => {
            om.actions.home.forkCurrentList()
          }}
        >
          <Box padding={5} paddingHorizontal={5} backgroundColor="#fff">
            <HStack alignItems="center" spacing={6}>
              <Edit2 size={12} color="#777" />
              <Text
                style={{
                  color: 'inherit',
                  fontSize: 16,
                  fontWeight: '700',
                }}
              >
                My list
              </Text>
            </HStack>
          </Box>
        </LinkButton>
      )}
    </HStack>
  )
}

const HomeSearchResultsViewContent = memo(
  ({ state }: { state: HomeStateItemSearch }) => {
    const om = useOvermind()
    const allRestaurants = om.state.home.allRestaurants
    const topPad = 0

    const resultsIds = state.results?.results?.restaurantIds ?? []
    const resultsAll = resultsIds.map((id) => allRestaurants[id])
    const [showAll, setShowAll] = useState(false)
    let results = showAll ? resultsAll : resultsAll.slice(0, 4)

    // load a few at a time, less to start
    const isLoading = results[0]?.name == null

    useDebounceEffect(
      () => {
        if (!isLoading) {
          setShowAll(true)
        }
      },
      500,
      [isLoading]
    )

    if (!state.results?.results || state.results.status === 'loading') {
      return (
        <VStack paddingTop={topPad}>
          <LoadingItems />
        </VStack>
      )
    }

    if (!results.length) {
      return (
        <VStack
          height="100vh"
          alignItems="center"
          justifyContent="center"
          spacing
        >
          <Text style={{ fontSize: 22 }}>No results 😞</Text>
          <LinkButton name="contact">Send us the address</LinkButton>
        </VStack>
      )
    }

    return (
      <ScrollView>
        <HomePageSearchResultsDishes state={state} />
        <VStack paddingTop={topPad} paddingBottom={20}>
          {/* <SuspenseList revealOrder="forwards"> */}
          {results.map((item, index) => (
            <Suspense key={item.id} fallback={null}>
              <RestaurantListItem
                currentLocationInfo={state.currentLocationInfo}
                restaurant={item}
                rank={index + 1}
              />
            </Suspense>
          ))}
          {/* </SuspenseList> */}
        </VStack>
      </ScrollView>
    )
    // return (
    //   <List
    //     data={[topPad, ...results, 20]}
    //     estimatedHeight={182}
    //     renderItem={({ item, index }) => {
    //       if (typeof item == 'number') {
    //         return <Spacer size={item} />
    //       }
    //       return (

    //       )
    //     }}
    //   />
    // )
  }
)

const HomePageSearchResultsDishes = memo(
  graphql(({ state }: { state: HomeStateItemSearch }) => {
    const om = useOvermind()
    const activeTags = getActiveTags(om.state.home, state)

    if (activeTags.some((tag) => tag.type !== 'country')) {
      return null
    }

    // TODO use a real
    const dishes = query.dish({
      limit: 6,
    })

    console.log('got dishes', dishes)

    return dishes.map((dish) => (
      <DishView
        key={dish.name}
        dish={{
          name: dish.name,
          image: dish.image,
          rating: 5,
          count: 1,
        }}
      />
    ))
  })
)

function List(props: {
  data: any[]
  estimatedHeight?: number
  renderItem: (arg: { item: any; index: number }) => React.ReactNode
}) {
  // TODO suspense or flatlist depending for now simple waterfall
  return (
    <ScrollView
      onScroll={() => {
        if (popoverCloseCbs.size) {
          closeAllPopovers()
        }
      }}
    >
      {props.data.map((item, index) => (
        <ListItem
          estimatedHeight={props.estimatedHeight}
          key={item.id ?? index}
        >
          {props.renderItem({ item, index })}
        </ListItem>
      ))}
    </ScrollView>
  )
}

function ListItem(props) {
  const [isMounted, setIsMounted] = useState(false)
  useWaterfall(() => {
    setIsMounted(true)
  })
  return isMounted
    ? props.children
    : props.loading ?? <View style={{ height: props.estimatedHeight }} />
}
