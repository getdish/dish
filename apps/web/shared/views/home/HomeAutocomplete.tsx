import React, { memo, useEffect } from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'

import { searchBarHeight, searchBarTopOffset } from '../../constants'
import { useOvermind } from '../../state/om'
import { LinearGradient } from '../ui/LinearGradient'
import { LinkButton } from '../ui/Link'
import { HStack, ZStack } from '../ui/Stacks'
import {
  circularFlatButtonStyle,
  flatButtonStyle,
  flatButtonStyleActive,
} from './baseButtonStyle'

export default memo(function HomeAutoComplete() {
  const om = useOvermind()
  const {
    showAutocomplete,
    autocompleteIndex,
    autocompleteResultsActive,
    currentStateType,
    isAutocompleteActive,
  } = om.state.home
  const showLocation = showAutocomplete == 'location'
  const showSearch = showAutocomplete == 'search'
  const isShowing = showSearch || showLocation

  // hide when moused away, show when moved back!
  useEffect(() => {
    let tmOff
    const handleMove = (e) => {
      const y = e.pageY
      const showAutocomplete = om.state.home.showAutocomplete
      if (showAutocomplete) {
        if (y > 140) {
          tmOff = setTimeout(() => {
            om.actions.home.setShowAutocomplete(false)
          }, 80)
        }
      } else {
        if (y < 140) {
          clearTimeout(tmOff)
        }
      }
    }
    window.addEventListener('mousemove', handleMove)
    return () => {
      window.removeEventListener('mousemove', handleMove)
    }
  }, [isShowing])

  const gradient = (
    <LinearGradient
      colors={['rgba(0,0,0,0.1)', 'transparent']}
      style={[StyleSheet.absoluteFill, { height: 160 }]}
    />
  )

  return (
    <>
      <ZStack
        className="ease-in-out-fast"
        opacity={isShowing ? 1 : 0}
        disabled={!isShowing}
        fullscreen
        zIndex={11}
      >
        <TouchableOpacity
          style={[StyleSheet.absoluteFill]}
          onPress={() => {
            om.actions.home.setShowAutocomplete(false)
          }}
        >
          {gradient}
        </TouchableOpacity>
      </ZStack>
      <ZStack
        className="ease-in-out-fast"
        position="absolute"
        top={searchBarTopOffset + searchBarHeight}
        left="15%"
        width="calc(100vw - 10%)"
        maxWidth={1050}
        zIndex={1000}
        overflow="hidden"
        paddingBottom={30}
        paddingHorizontal={15}
        marginLeft={-30}
        opacity={isShowing ? 1 : 0}
        transform={isShowing ? null : [{ translateY: 5 }]}
        disabled={!isShowing}
      >
        <HStack
          backgroundColor="rgba(255,255,255,1)"
          borderBottomRightRadius={10}
          borderBottomLeftRadius={10}
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
            paddingHorizontal={10}
            overflow="scroll"
            spacing="sm"
          >
            {autocompleteResultsActive.map((x, index) => {
              return (
                <LinkButton
                  key={`${x.tagId}${index}`}
                  onPress={() => {
                    if (showLocation) {
                      om.actions.home.setLocation(x.name)
                    } else {
                      om.actions.home.navigateToTagId(x.tagId)
                    }
                    om.actions.home.setShowAutocomplete(false)
                  }}
                  flexDirection="row"
                  height={34}
                  lineHeight={24}
                  fastClick
                  alignItems="center"
                  {...(isAutocompleteActive && autocompleteIndex === index
                    ? flatButtonStyleActive
                    : flatButtonStyle)}
                  paddingHorizontal={10}
                  fontSize={16}
                  maxWidth="15vw"
                  ellipse
                >
                  {x.icon?.indexOf('http') === 0 ? (
                    <img
                      src={x.icon}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 100,
                        marginRight: 10,
                        marginTop: -2,
                        marginBottom: -2,
                      }}
                    />
                  ) : (
                    x.icon ?? null
                  )}
                  {x.name}{' '}
                  {x.type === 'dish' &&
                  index !== 0 &&
                  currentStateType === 'search' &&
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
