import { LinearGradient } from 'expo-linear-gradient'
import Fuse from 'fuse.js'
import React, { memo, useEffect, useMemo } from 'react'
import { StyleSheet } from 'react-native'

import { sleep } from '../../helpers/sleep'
import { useOvermind } from '../../state/om'
import { LinkButton } from '../shared/Link'
import { HStack, ZStack } from '../shared/Stacks'
import {
  homeSearchBarEl,
  searchBarHeight,
  searchBarTopOffset,
} from './HomeSearchBar'
import { flatButtonStyle } from './HomeViewTopDishes'

export default memo(function HomeAutoComplete() {
  const om = useOvermind()
  const state = om.state.home.currentState
  const autocompleteResults = om.state.home.autocompleteResults
  const query = state.searchQuery
  const isShowing = query === 'taco' || om.state.home.showAutocomplete

  // hide when moused away, show when moved back!
  useEffect(() => {
    let tmOff
    const handleMove = (e) => {
      const y = e.pageY
      const showAutocomplete = om.state.home.showAutocomplete
      if (showAutocomplete) {
        if (y > 190) {
          tmOff = setTimeout(() => {
            om.actions.home.setShowAutocomplete(false)
          }, 150)
        }
      } else {
        if (y < 190) {
          clearTimeout(tmOff)
        }
      }
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [isShowing])

  return (
    <>
      <ZStack
        className="ease-in-out-fast"
        opacity={isShowing ? 1 : 0}
        disabled={!isShowing}
        fullscreen
        zIndex={20}
      >
        {/* <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'transparent']}
          style={[StyleSheet.absoluteFill, { height: 140 }]}
        /> */}
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.1)', 'transparent']}
          style={[StyleSheet.absoluteFill, { height: 160 }]}
        />
      </ZStack>
      <ZStack
        className="ease-in-out-fast"
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
        transform={isShowing ? null : [{ translateY: 5 }]}
        disabled={!isShowing}
      >
        <HStack
          backgroundColor="rgba(255,255,255,1)"
          borderRadius={10}
          borderTopLeftRadius={0}
          height={50}
          paddingBottom={1} // looks better 1px up
          shadowColor="rgba(0,0,0,0.1)"
          shadowRadius={20}
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
            {autocompleteResults.map((x) => {
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
                  key={x.id}
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
