import { Restaurant, Review } from '@dish/models'
import React, { memo, useEffect, useRef, useState } from 'react'
import { ScrollView, Text, TextInput } from 'react-native'

import { useDebounceEffect } from '../../hooks/useDebounceEffect'
import { useForceUpdate } from '../../hooks/useForceUpdate'
import { useOvermind } from '../../state/om'
import { Toast } from '../Toast'
import { Box } from '../ui/Box'
import { Icon } from '../ui/Icon'
import { LinkButton } from '../ui/Link'
import { Popover } from '../ui/Popover'
import { Spacer } from '../ui/Spacer'
import { HStack, VStack } from '../ui/Stacks'
import { getInputNode } from './HomeSearchBar'
import { LenseButton } from './LenseButton'

export const RestaurantFavoriteStar = memo(
  ({
    size = 'md',
    restaurantId,
  }: {
    isHovered?: boolean
    size?: 'lg' | 'md'
    restaurantId: string
  }) => {
    const sizePx = size == 'lg' ? 26 : 16
    const om = useOvermind()
    const [isOpen, setIsOpen] = useState(false)
    const [timer, setTimer] = useState(null)
    const forceUpdate = useForceUpdate()
    const review = useRef<Review>(new Review())
    const showContent = isOpen
    const isStarred = review.current.rating > 0

    const persist = async () => {
      await om.actions.user.submitReview(review.current)
      Toast.show('Saved')
    }
    const setRating = (r: number) => {
      if (!om.actions.user.ensureLoggedIn()) {
        return
      }
      review.current.rating = r
      setIsOpen(r == 1)
      review.current.restaurant_id = restaurantId
      persist()
      forceUpdate()
    }

    const [input, setInput] = useState<any>(null)
    const node = getInputNode(input)
    useDebounceEffect(
      () => {
        if (showContent && node) {
          const tm = requestIdleCallback(() => {
            node.focus()
          })
          return () => {
            clearTimeout(tm)
          }
        }
      },
      16,
      [node, showContent]
    )

    return (
      <Popover
        isOpen={isOpen}
        onChangeOpen={setIsOpen}
        overlay
        position="right"
        contents={
          <Box width={520}>
            {showContent && (
              <>
                <HStack>
                  <TextInput
                    ref={setInput}
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
                        <Icon size={20} name="Tag" />
                        {om.state.home.allLenseTags
                          .filter((x) => x.isVotable)
                          .map((lense) => (
                            <LenseButton
                              key={lense.id}
                              lense={lense}
                              isActive={false}
                            />
                          ))}
                        <Spacer />
                      </HStack>
                    </ScrollView>
                  </VStack>
                </HStack>
              </>
            )}
          </Box>
        }
      >
        <LinkButton onPress={() => setRating(isStarred ? 0 : 1)}>
          <VStack
            marginTop={2}
            width={sizePx}
            height={sizePx}
            overflow="hidden"
          >
            {isStarred && (
              <Text
                style={{
                  fontSize: sizePx * 0.88,
                  lineHeight: sizePx * 0.88,
                  marginTop: 3,
                  marginLeft: 2,
                }}
              >
                ⭐️
              </Text>
            )}
            {!isStarred && (
              <Icon size={sizePx} name="Star" color={'goldenrod'} />
            )}
          </VStack>
        </LinkButton>
      </Popover>
    )
  }
)
