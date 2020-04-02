import { LinearGradient } from 'expo-linear-gradient'
import React, { memo, useEffect, useState } from 'react'
import { StyleSheet, Text } from 'react-native'

import { useOvermind } from '../../state/om'
import { Link, LinkButton } from '../shared/Link'
import { HStack, ZStack } from '../shared/Stacks'
import { searchBarHeight, searchBarTopOffset } from './HomeSearchBar'
import {
  circularFlatButtonStyle,
  flatButtonStyle,
  flatButtonStyleActive,
  flatButtonStyleInactive,
} from './HomeViewTopDishes'

export default memo(function HomeAutoComplete({ active }: { active: number }) {
  const om = useOvermind()
  const state = om.state.home.currentState
  const autocompleteResults = om.state.home.autocompleteResults
  const query = state.searchQuery
  const isShowing =
    query.length !== 0 && (query === 'taco' || om.state.home.showAutocomplete)

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
        width="calc(100vw - 15%)"
        maxWidth={850}
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
          <HStack
            height="100%"
            flex={1}
            alignItems="center"
            paddingHorizontal={20}
            overflow="scroll"
            spacing="sm"
          >
            {[
              { name: state.searchQuery, id: '-1', type: 'none' },
              ...autocompleteResults,
            ].map((x, index) => {
              return (
                <LinkButton
                  name="search"
                  flexDirection="row"
                  params={{ query: x.name }}
                  height={34}
                  fastClick
                  alignItems="center"
                  justifyContent="center"
                  {...(x.id === '-1'
                    ? flatButtonStyleInactive
                    : active === index
                    ? flatButtonStyleActive
                    : flatButtonStyle)}
                  paddingHorizontal={10}
                  fontSize={15}
                  maxWidth={180}
                  ellipse
                  key={x.id}
                >
                  {x.name}{' '}
                  {x.type === 'dish' &&
                  index !== 0 &&
                  om.state.home.currentState.type === 'search' &&
                  om.state.auth.is_logged_in ? (
                    <LinkButton
                      {...circularFlatButtonStyle}
                      marginVertical={-4}
                      onPress={(e) => {
                        console.log('e', e)
                        alert('add to current search results')
                      }}
                    >
                      +
                    </LinkButton>
                  ) : null}
                </LinkButton>
              )
            })}
          </HStack>
        </HStack>
      </ZStack>
    </>
  )
})
