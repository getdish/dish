// debug
import { Circle, HStack, Spacer, Text, VStack, ZStack } from '@dish/ui'
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

  console.log('HomeAutoComplete', { isShowing, showAutocomplete })

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
      className="ease-in-out-faster"
      position="absolute"
      top={searchBarTopOffset + searchBarHeight}
      left="2%"
      right="2%"
      zIndex={3000}
      paddingBottom={30}
      paddingHorizontal={15}
      opacity={isShowing ? 1 : 0}
      transform={isShowing ? [] : [{ translateY: -10 }]}
      disabled={!isShowing}
    >
      <HStack
        backgroundColor="rgba(0,0,0,0.95)"
        borderRadius={100}
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
            {autocompleteResultsActive.map((tag, index) => {
              const restaurantLinkProps: LinkButtonProps | null =
                tag.type == 'restaurant'
                  ? {
                      tag: null,
                      name: 'restaurant',
                      params: {
                        slug: tag.tagId,
                      },
                      onPress: () => {
                        console.log('press')
                        om.actions.home.setShowAutocomplete(false)
                      },
                    }
                  : null

              const plusButtonEl =
                tag.type === 'dish' &&
                index !== 0 &&
                om.state.user.isLoggedIn ? (
                  <AutocompleteAddButton />
                ) : null

              const isActive = autocompleteIndex === index

              const iconElement = (
                <VStack marginVertical={-2}>
                  {tag.icon?.indexOf('http') === 0 ? (
                    <img
                      src={tag.icon}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 100,
                      }}
                    />
                  ) : tag.icon ? (
                    <Circle size={26} backgroundColor="rgba(150,150,150,0.1)">
                      <Text>{tag.icon} </Text>
                    </Circle>
                  ) : null}
                </VStack>
              )

              return (
                <LinkButton
                  key={`${tag.tagId}${index}`}
                  className=""
                  onPress={() => {
                    setAvoidNextAutocompleteShowOnFocus()
                    if (showLocation) {
                      om.actions.home.setLocation(tag.name)
                    }
                    console.log('set false')
                    om.actions.home.setShowAutocomplete(false)
                  }}
                  {...(!showLocation && {
                    tag,
                  })}
                  alignItems="center"
                  justifyContent="center"
                  lineHeight={24}
                  paddingVertical={5}
                  paddingHorizontal={10}
                  borderRadius={100}
                  backgroundColor={'transparent'}
                  fontSize={14}
                  maxWidth="17vw"
                  hoverStyle={{
                    backgroundColor: 'rgba(100,100,100,0.65)',
                  }}
                  {...(isActive && {
                    backgroundColor: '#fff',
                  })}
                  {...restaurantLinkProps}
                >
                  <HStack>
                    {iconElement}
                    {!!iconElement && <Spacer size={6} />}
                    <Text ellipse color={isActive ? '#000' : '#fff'}>
                      {tag.name} {plusButtonEl}
                    </Text>
                  </HStack>
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
