import Fuse from 'fuse.js'
import React, { memo, useMemo } from 'react'

import { useOvermind } from '../../state/om'
import { LinkButton } from '../shared/Link'
import { HStack, ZStack } from '../shared/Stacks'
import { searchBarHeight, searchBarTopOffset } from './HomeSearchBar'
import { flatButtonStyle } from './HomeViewTopDishes'

const options = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  minMatchCharLength: 1,
  keys: ['title', 'author.firstName'],
}

export default memo(function HomeAutoComplete() {
  const om = useOvermind()
  const state = om.state.home.currentState
  const allDishes = om.state.home.allTopDishes
  const query = state.searchQuery
  const isShowing = query === 'test' || om.state.home.showAutocomplete

  const fuzzy = useMemo(() => new Fuse(allDishes, options), [allDishes])

  const results = useMemo(() => {
    let found = fuzzy.search(query, { limit: 10 }).map((x) => x.item)
    if (found.length < 10) {
      found = [...found, ...allDishes.slice(0, 10 - found.length)]
    }
    return found
  }, [query])

  return (
    <>
      <ZStack
        opacity={isShowing ? 1 : 0}
        pointerEvents={isShowing ? 'auto' : 'none'}
        fullscreen
        zIndex={20}
        backgroundColor="rgba(0,0,0,0.1)"
      />
      <ZStack
        position="absolute"
        top={searchBarTopOffset + searchBarHeight}
        left={70}
        width="calc(100vw - 200px)"
        zIndex={1000}
        overflow="hidden"
        paddingBottom={30}
        paddingHorizontal={30}
        marginLeft={-30}
        opacity={isShowing ? 1 : 0}
        pointerEvents={isShowing ? 'auto' : 'none'}
      >
        <HStack
          backgroundColor="rgba(255,255,255,1)"
          shadowColor="rgba(0,0,0,0.2)"
          borderRadius={10}
          borderTopLeftRadius={0}
          height={50}
          paddingBottom={1} // looks better 1px up
          shadowRadius={30}
          shadowOffset={{ width: 0, height: 3 }}
          spacing
          position="relative"
        >
          {/* <ZStack
          fullscreen
          borderRadius={10}
          // borderTopLeftRadius={0}
          overflow="hidden"
        >
          <BlurView />
        </ZStack> */}
          <HStack
            height="100%"
            flex={1}
            alignItems="center"
            paddingHorizontal={20}
            overflow="scroll"
            spacing="sm"
          >
            {results.map((x) => {
              return (
                <LinkButton
                  name="search"
                  params={{ query: `${query} ${x.name}` }}
                  height={35}
                  alignItems="center"
                  justifyContent="center"
                  {...flatButtonStyle}
                  paddingHorizontal={12}
                  fontSize={16}
                  maxWidth={130}
                  ellipse
                  key={x.name}
                >
                  {x.name}
                </LinkButton>
              )
            })}
          </HStack>
        </HStack>
      </ZStack>
    </>
  )
})
