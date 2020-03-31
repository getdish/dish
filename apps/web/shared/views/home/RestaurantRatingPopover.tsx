import { Restaurant, Review } from '@dish/models'
import React, { memo, useEffect, useRef, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import { useOvermind } from '../../state/om'
import Hoverable from '../shared/Hoverable'
import { Icon } from '../shared/Icon'
import { Popover } from '../shared/Popover'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack } from '../shared/Stacks'
import { Toast } from '../shared/Toast'
import { Tooltip } from '../shared/Tooltip'
import { EmojiButton } from './EmojiButton'
import { LenseButton } from './HomeLenseBar'

export const RestaurantRatingPopover = memo(
  ({
    restaurant,
    isHovered,
  }: {
    restaurant: Restaurant
    isHovered: boolean
  }) => {
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

    if (!isHovered) {
      return null
    }

    const showContent = review.current?.rating !== 0
    return (
      <Popover
        isOpen={isOpen}
        position="right"
        onClickOutside={() => {
          if (isOpen) {
            setRating(0)
          }
        }}
        contents={
          <Tooltip width={620}>
            {showContent && (
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
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
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
            )}
          </Tooltip>
        }
      >
        <div
          style={{
            filter: review.current?.rating !== 0 ? '' : 'grayscale(100%)',
          }}
        >
          <VStack width={26}>
            <VoteButton
              style={styles.topButton}
              onPress={() => {
                if (review.current?.rating == 1) return setRating(0)
                setRating(1)
              }}
            >
              <Icon
                name="chevron-up"
                size={15}
                color={review.current?.rating === 1 ? 'green' : 'black'}
                marginBottom={-12}
              />
            </VoteButton>
            <VoteButton
              style={styles.bottomButton}
              onPress={() => {
                if (review.current?.rating == -1) return setRating(0)
                setRating(-1)
              }}
            >
              <Icon
                name="chevron-down"
                size={15}
                color={review.current?.rating === -1 ? 'red' : 'black'}
              />
            </VoteButton>
          </VStack>
        </div>
      </Popover>
    )
  }
)

const VoteButton = (props: any) => {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <Hoverable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      <TouchableOpacity onPress={props.onPress}>
        <View style={[styles.button, isHovered && styles.hovered, props.style]}>
          {props.children}
        </View>
      </TouchableOpacity>
    </Hoverable>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    width: 20,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowRadius: 3,
  },
  hovered: {
    backgroundColor: 'red',
  },
  topButton: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 0,
    paddingBottom: 5,
  },
  bottomButton: {
    paddingTop: 5,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
})
