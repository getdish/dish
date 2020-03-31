import { Restaurant, Review } from '@dish/models'
import React, { memo, useRef, useState } from 'react'
import { ScrollView, Text, TextInput } from 'react-native'

import { useForceUpdate } from '../../hooks/useForceUpdate'
import { useOvermind } from '../../state/om'
import { Icon } from '../shared/Icon'
import { Popover } from '../shared/Popover'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack } from '../shared/Stacks'
import { Toast } from '../shared/Toast'
import { Tooltip } from '../shared/Tooltip'
import { HoverableButton } from './HoverableButton'
import { LenseButton } from './LenseButton'

export const RestaurantFavoriteStar = memo(
  ({
    size = 'md',
    restaurant,
  }: {
    isHovered?: boolean
    size?: 'lg' | 'md'
    restaurant: Restaurant
  }) => {
    const sizePx = size == 'lg' ? 26 : 24
    const om = useOvermind()
    const [isOpen, setIsOpen] = useState(false)
    const [timer, setTimer] = useState(null)
    const forceUpdate = useForceUpdate()
    const review = useRef<Review>(new Review())
    const showContent = isOpen
    const isStarred = review.current.rating > 0

    const persist = async () => {
      await om.actions.home.submitReview(review.current)
      Toast.show('Saved')
    }
    const setRating = (r: number) => {
      review.current.rating = r
      setIsOpen(r == 1)
      review.current.restaurant_id = restaurant.id
      persist()
      forceUpdate()
    }

    return (
      <Popover
        isOpen={isOpen}
        overlay
        position="right"
        onClickOutside={() => {
          setIsOpen(false)
        }}
        contents={
          <Tooltip width={520}>
            {showContent && (
              <>
                <HStack>
                  <TextInput
                    multiline
                    numberOfLines={6}
                    placeholder="Your Review"
                    value={review.current?.text}
                    onChangeText={async (t: string) => {
                      review.current.text = t
                      persist()
                    }}
                    onKeyPress={() => {
                      clearTimeout(timer)
                      setTimer(setTimeout(persist, 1000))
                    }}
                    style={{
                      width: '100%',
                      flex: 1,
                      height: 100,
                      fontSize: 16,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 10,
                      padding: 10,
                    }}
                  />
                </HStack>
                <Spacer />
                <HStack flex={1} alignItems="center">
                  <VStack>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      <HStack alignItems="center" spacing={size}>
                        <Icon size={20} name="tag" />
                        {om.state.home.allLenses
                          .filter((x) => x.isVotable)
                          .map((lense) => (
                            <LenseButton key={lense.id} lense={lense} />
                          ))}
                        <Spacer />
                      </HStack>
                    </ScrollView>
                  </VStack>
                </HStack>
              </>
            )}
          </Tooltip>
        }
      >
        <HoverableButton
          isHovered={isStarred}
          onPress={() => setRating(isStarred ? 0 : 1)}
        >
          <VStack width={sizePx} height={sizePx}>
            {isStarred && (
              <Text
                style={{
                  fontSize: sizePx * 0.9,
                  lineHeight: sizePx * 0.9,
                  marginTop: 3,
                  marginLeft: 2,
                }}
              >
                ⭐️
              </Text>
            )}
            {!isStarred && (
              <Icon size={sizePx} name="star" color={'goldenrod'} />
            )}
          </VStack>
        </HoverableButton>
      </Popover>
    )
  }
)
