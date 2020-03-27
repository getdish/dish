import React, { useState, memo, useRef } from 'react'
import { TouchableOpacity, TextInput, ScrollView, Text } from 'react-native'
import { Restaurant, Review } from '@dish/models'
import { HStack, VStack } from '../shared/Stacks'
import { Spacer } from '../shared/Spacer'
import { useOvermind } from '../../state/om'
import { Popover } from '../shared/Popover'
import { Tooltip } from '../shared/Stack/Tooltip'
import { Icon } from '../shared/Icon'
import { EmojiButton } from './RestaurantListItem'
import { LenseButton } from './HomeLenseBar'
import { HomeStateItemRestaurant } from '../../state/home'

export const RestaurantRatingPopover = memo(
  ({ restaurant }: { restaurant: Restaurant }) => {
    const om = useOvermind()
    const [isOpen, setIsOpen] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [timer, setTimer] = useState(null)
    const review = useRef<Review>(new Review())
    const persist = async () => {
      await om.actions.home.submitReview(review.current)
      setFeedback('saved')
      setTimeout(() => {
        setFeedback('')
      }, 500)
    }
    const setRating = (r: number) => {
      if (r == 0) {
        return
      }
      om.actions.home.setReview({ rating: r })
      setIsOpen(true)
      persist()
    }
    let content = null
    if (review.current?.rating !== 0) {
      content = (
        <>
          <HStack>
            <HStack
              borderColor="#ddd"
              borderWidth={1}
              borderRadius={100}
              margin={5}
              padding={5}
              alignItems="stretch"
            >
              <EmojiButton
                onPress={() => setRating(-1)}
                active={review.current?.rating === -1}
              >
                👎
              </EmojiButton>
              <EmojiButton
                onPress={() => setRating(1)}
                active={review.current?.rating === 1}
              >
                👍
              </EmojiButton>
              <EmojiButton
                onPress={() => setRating(2)}
                active={review.current?.rating === 2}
              >
                🤤
              </EmojiButton>
            </HStack>

            <TextInput
              multiline
              numberOfLines={6}
              placeholder="Notes"
              value={review.current?.text}
              onChangeText={async (t: string) => {
                om.actions.home.setReview({ text: t })
              }}
              onKeyPress={() => {
                clearTimeout(timer)
                setTimer(setTimeout(persist, 1000))
              }}
              style={{
                width: '100%',
                flex: 1,
                height: 100,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
                padding: 10,
              }}
            />
            <Text>{feedback}</Text>
          </HStack>
          <Spacer />
          <HStack alignItems="center">
            <VStack>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack alignItems="center">
                  <Spacer />

                  <Icon size={20} name="tag" />

                  <Spacer />

                  {om.state.home.lastHomeState.lenses
                    .filter((x) => x.isVotable)
                    .map((lense) => (
                      <React.Fragment key={lense.id}>
                        <LenseButton active={false} lense={lense} />
                        <Spacer />
                      </React.Fragment>
                    ))}
                  <Spacer />
                </HStack>
              </ScrollView>
            </VStack>
          </HStack>
        </>
      )
    }
    return (
      <Popover
        isOpen={isOpen}
        position="right"
        onClickOutside={() => {
          if (isOpen) {
            setRating(0)
          }
        }}
        target={
          <div
            style={{
              filter: review.current?.rating !== 0 ? '' : 'grayscale(100%)',
            }}
          >
            <VStack>
              <TouchableOpacity
                onPress={() => {
                  if (review.current?.rating == 1) return setRating(0)
                  setRating(1)
                }}
              >
                <Icon
                  name="chevron-up"
                  size={24}
                  color={review.current?.rating === 1 ? 'green' : 'black'}
                  marginBottom={-12}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (review.current?.rating == -1) return setRating(0)
                  setRating(-1)
                }}
              >
                <Icon
                  name="chevron-down"
                  size={24}
                  color={review.current?.rating === -1 ? 'red' : 'black'}
                />
              </TouchableOpacity>
            </VStack>
          </div>
        }
      >
        <Tooltip width={620}>{content}</Tooltip>
      </Popover>
    )
  }
)
