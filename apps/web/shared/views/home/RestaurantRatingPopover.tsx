import React, { useState, memo } from 'react'
import { TouchableOpacity, TextInput, ScrollView, Text } from 'react-native'
import { Restaurant } from '@dish/models'
import { HStack, VStack } from '../shared/Stacks'
import { Spacer } from '../shared/Spacer'
import { useOvermind } from '../../state/om'
import { Popover } from '../shared/Popover'
import { Tooltip } from '../shared/Stack/Tooltip'
import { Icon } from '../shared/Icon'
import { EmojiButton } from './RestaurantListItem'
import { LenseButton } from './HomeLenseBar'

export const RestaurantRatingPopover = memo(
  ({
    restaurant,
    onChangeOpen,
  }: {
    restaurant: Restaurant
    onChangeOpen: Function
  }) => {
    const om = useOvermind()
    const state = om.state.home.currentState
    if (state.type != 'restaurant') return
    const [feedback, setFeedback] = useState('')
    const [timer, setTimer] = useState(null)
    const persist = async () => {
      await om.actions.home.submitReview()
      setFeedback('saved')
      setTimeout(() => {
        setFeedback('')
      }, 500)
    }
    const setRating = (r: number) => {
      om.actions.home.setReview({ rating: r })
      onChangeOpen(r !== 0)
      persist()
    }
    let content = null
    if (state.review?.rating !== 0) {
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
                active={state.review?.rating === -1}
              >
                👎
              </EmojiButton>
              <EmojiButton
                onPress={() => setRating(1)}
                active={state.review?.rating === 1}
              >
                👍
              </EmojiButton>
              <EmojiButton
                onPress={() => setRating(2)}
                active={state.review?.rating === 2}
              >
                🤤
              </EmojiButton>
            </HStack>

            <TextInput
              multiline
              numberOfLines={6}
              placeholder="Notes"
              value={state.review?.text}
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
        isOpen={state.review?.rating !== 0}
        position="right"
        onClickOutside={() => {
          setRating(0)
        }}
        target={
          <div
            style={{
              filter: state.review?.rating !== 0 ? '' : 'grayscale(100%)',
            }}
          >
            <VStack>
              <TouchableOpacity
                onPress={() => {
                  if (state.review?.rating == 1) return setRating(0)
                  setRating(1)
                }}
              >
                <Icon
                  name="chevron-up"
                  size={24}
                  color={state.review?.rating === 1 ? 'green' : 'black'}
                  marginBottom={-12}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (state.review?.rating == -1) return setRating(0)
                  setRating(-1)
                }}
              >
                <Icon
                  name="chevron-down"
                  size={24}
                  color={state.review?.rating === -1 ? 'red' : 'black'}
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
