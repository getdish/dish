import React, { memo, useEffect } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'

import { searchBarHeight, searchBarTopOffset } from '../../constants'
import { useOvermind } from '../../state/om'
import { LinearGradient } from '../ui/LinearGradient'
import { LinkButton, LinkButtonProps } from '../ui/Link'
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
        width="calc(100vw - 15%)"
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
          borderBottomRightRadius={12}
          borderBottomLeftRadius={12}
          height={49}
          paddingBottom={1} // looks better 1px up
          shadowColor="rgba(0,0,0,0.28)"
          shadowRadius={18}
          shadowOffset={{ width: 0, height: 3 }}
          spacing
          position="relative"
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HStack
              height="100%"
              flex={1}
              alignItems="center"
              paddingHorizontal={10}
              spacing={6}
            >
              {autocompleteResultsActive.map((x, index) => {
                const restaurantLinkProps: LinkButtonProps = x.type ==
                  'restaurant' && {
                  tag: null,
                  name: 'restaurant',
                  params: {
                    slug: x.tagId,
                  },
                  onPress: () => {
                    console.log('press')
                    om.actions.home.setShowAutocomplete(false)
                  },
                }
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
                    {...(!showLocation && {
                      tag: x,
                    })}
                    flexDirection="row"
                    fastClick
                    alignItems="center"
                    {...(isAutocompleteActive && autocompleteIndex === index
                      ? flatButtonStyleActive
                      : flatButtonStyle)}
                    height={32}
                    lineHeight={24}
                    paddingHorizontal={10}
                    fontSize={15}
                    maxWidth="17vw"
                    ellipse
                    {...restaurantLinkProps}
                  >
                    {x.icon?.indexOf('http') === 0 ? (
                      <img
                        src={x.icon}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 100,
                          marginRight: 10,
                          marginTop: 'auto',
                          marginBottom: 'auto',
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
          </ScrollView>
        </HStack>
      </ZStack>
    </>
  )
})
