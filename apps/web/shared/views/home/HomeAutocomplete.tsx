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
} from './baseButtonStyle'

export default memo(function HomeAutoComplete() {
  const om = useOvermind()
  const { autocompleteIndex } = om.state.home
  const query = om.state.home.currentStateSearchQuery
  const { showAutocomplete } = om.state.home

  const showLocation = showAutocomplete == 'location'
  const showSearch = showAutocomplete == 'search'
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
        zIndex={11}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'transparent']}
          style={[StyleSheet.absoluteFill, { height: 160 }]}
        />
      </ZStack>
      <ZStack
        className="ease-in-out-fast"
        position="absolute"
        top={searchBarTopOffset + searchBarHeight}
        left="15%"
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
            {om.state.home.activeAutocompleteResults.map((x, index) => {
              return (
                <LinkButton
                  onPress={() => {
                    if (showLocation) {
                      om.actions.home.setLocation(x.name)
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
                  {...(om.state.home.isAutocompleteActive &&
                  autocompleteIndex === index
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
                  om.state.home.currentStateType === 'search' &&
                  om.state.user.isLoggedIn ? (
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
