import React, { memo, useRef, useState } from 'react'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native'

import { Restaurant, Review } from '@dish/models'

import { useOvermind } from '../../state/om'
import { Icon } from '../shared/Icon'
import { Popover } from '../shared/Popover'
import { Spacer } from '../shared/Spacer'
import { Tooltip } from '../shared/Stack/Tooltip'
import { HStack, VStack } from '../shared/Stacks'
import { Toast } from '../shared/Toast'
import { EmojiButton } from './EmojiButton'
import { LenseButton } from './HomeLenseBar'

export const RestaurantRatingPopover = memo(
  ({ restaurant }: { restaurant: Restaurant }) => {
    const om = useOvermind()
    const [isOpen, setIsOpen] = useState(false)
    const [timer, setTimer] = useState(null)
    const review = useRef<Review>(new Review())

    const persist = async () => {
      await om.actions.home.submitReview(review.current)
      Toast.show('Saved')
    }

    const setRating = (r: number) => {
      if (r == 0) {
        return
      }
      review.current.rating = r
      persist()
      setIsOpen(true)
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
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
                padding: 10,
              }}
            />
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
        contents={<Tooltip width={620}>{content}</Tooltip>}
      >
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
      </Popover>
    )
  }
)
