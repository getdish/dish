import { HStack, Text, ZStack } from '@dish/ui'
import React, { memo, useEffect } from 'react'
import { Plus } from 'react-feather'
import { ScrollView } from 'react-native'

import { searchBarHeight, searchBarTopOffset } from '../../constants'
import { useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../ui/LinkButton'
import { LinkButtonProps } from '../ui/LinkProps'
import { SmallCircleButton } from './CloseButton'
import { setAvoidNextAutocompleteShowOnFocus } from './HomeSearchBar'

export const useShowAutocomplete = () => {
  const om = useOvermind()
  const { showAutocomplete } = om.state.home
  const showLocation = showAutocomplete == 'location'
  const showSearch = showAutocomplete == 'search'
  return showSearch || showLocation
}

export default memo(function HomeAutoComplete() {
  const om = useOvermind()
  const {
    showAutocomplete,
    autocompleteIndex,
    autocompleteResultsActive,
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

  return (
    <ZStack
      className="ease-in-out-fast"
      position="absolute"
      top={searchBarTopOffset + searchBarHeight}
      left="2%"
      right="2%"
      zIndex={1000}
      overflow="hidden"
      paddingBottom={30}
      paddingHorizontal={15}
      opacity={isShowing ? 1 : 0}
      transform={isShowing ? [] : [{ translateY: 5 }]}
      disabled={!isShowing}
    >
      <HStack
        backgroundColor="rgba(0,0,0,0.95)"
        // className="blur"
        // borderBottomRightRadius={12}
        // borderBottomLeftRadius={12}
        overflow="hidden"
        borderRadius={10}
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
            paddingLeft={100}
            flex={1}
            alignItems="center"
            paddingHorizontal={10}
            spacing={6}
          >
            {autocompleteResultsActive.map((x, index) => {
              const restaurantLinkProps: LinkButtonProps | null =
                x.type == 'restaurant'
                  ? {
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
                  : null

              const plusButtonEl =
                x.type === 'dish' && index !== 0 && om.state.user.isLoggedIn ? (
                  <AutocompleteAddButton />
                ) : null

              const isActive = autocompleteIndex === index

              return (
                <LinkButton
                  key={`${x.tagId}${index}`}
                  onPress={() => {
                    setAvoidNextAutocompleteShowOnFocus()
                    if (showLocation) {
                      om.actions.home.setLocation(x.name)
                    }
                    console.log('set false')
                    om.actions.home.setShowAutocomplete(false)
                  }}
                  {...(!showLocation && {
                    tag: x,
                  })}
                  flexDirection="row"
                  alignItems="center"
                  height={32}
                  lineHeight={24}
                  paddingVertical={5}
                  paddingHorizontal={10}
                  borderRadius={10}
                  backgroundColor={
                    isActive ? 'rgba(0,0,0,0.35)' : 'transparent'
                  }
                  fontSize={15}
                  maxWidth="17vw"
                  hoverStyle={{
                    backgroundColor: 'rgba(100,100,100,0.5)',
                  }}
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
                  <Text color="#fff">
                    {x.name} {plusButtonEl}
                  </Text>
                </LinkButton>
              )
            })}
          </HStack>
        </ScrollView>
      </HStack>
    </ZStack>
  )
})

function AutocompleteAddButton() {
  const om = useOvermind()
  if (om.state.home.currentStateType !== 'userSearch') {
    return null
  }
  return (
    <SmallCircleButton
      onPressOut={(e) => {
        console.log('e', e)
        alert('add to current search results')
      }}
    >
      <Plus size={12} />
    </SmallCircleButton>
  )
}
