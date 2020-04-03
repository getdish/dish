import { LinearGradient } from 'expo-linear-gradient'
import React, { memo, useEffect } from 'react'
import { StyleSheet } from 'react-native'

import { searchBarHeight, searchBarTopOffset } from '../../constants'
import { useOvermind } from '../../state/om'
import { LinkButton } from '../shared/Link'
import { HStack, ZStack } from '../shared/Stacks'
import {
  circularFlatButtonStyle,
  flatButtonStyle,
  flatButtonStyleActive,
  flatButtonStyleInactive,
} from './baseButtonStyle'

export default memo(function HomeAutoComplete({ active }: { active: number }) {
  const om = useOvermind()
  const state = om.state.home.currentState
  const { autocompleteResults, showAutocomplete } = om.state.home
  const query = state.searchQuery

  const showLocation = showAutocomplete == 'location'
  const showSearch = showAutocomplete == 'search' && query.length !== 0
  const isShowing = showSearch || showLocation || query === 'taco'

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
              {
                name: showLocation
                  ? om.state.home.locationSearchQuery
                  : state.searchQuery,
                id: '-1',
                type: 'none',
              },
              ...(showLocation
                ? om.state.home.locationAutocompleteResults
                : autocompleteResults),
            ].map((x, index) => {
              return (
                <LinkButton
                  onPress={() => {
                    if (showLocation) {
                      om.actions.home.setLocationSearchQuery(x.name)
                    } else {
                      om.actions.router.navigate({
                        name: 'search',
                        params: {
                          query: x.name,
                        },
                      })
                    }
                  }}
                  flexDirection="row"
                  height={34}
                  lineHeight={24}
                  fastClick
                  alignItems="center"
                  {...(x.id === '-1'
                    ? flatButtonStyleInactive
                    : active === index
                    ? flatButtonStyleActive
                    : flatButtonStyle)}
                  paddingHorizontal={10}
                  fontSize={16}
                  maxWidth={180}
                  ellipse
                  key={x.id}
                >
                  {x.icon ?? null}
                  {x.name}{' '}
                  {x.type === 'dish' &&
                  index !== 0 &&
                  om.state.home.currentState.type === 'search' &&
                  om.state.auth.is_logged_in ? (
                    <LinkButton
                      {...circularFlatButtonStyle}
                      marginVertical={-2}
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
