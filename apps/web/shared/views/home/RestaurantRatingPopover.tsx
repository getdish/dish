import React, { useState, memo } from 'react'
import { TouchableOpacity, TextInput, ScrollView, Text } from 'react-native'
import { Restaurant } from '@dish/models'
import { HStack, VStack } from '../shared/Stacks'
import { Spacer } from '../shared/Spacer'
import { TagButton } from './TagButton'
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
    const [rating, set] = useState(0)
    const setRating = (x) => {
      set(x)
      onChangeOpen(x !== 0)
    }
    let content = null
    if (rating !== 0) {
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
              <EmojiButton onPress={() => setRating(-1)} active={rating === -1}>
                👎
              </EmojiButton>
              <EmojiButton onPress={() => setRating(1)} active={rating === 1}>
                👍
              </EmojiButton>
              <EmojiButton onPress={() => setRating(2)} active={rating === 2}>
                🤤
              </EmojiButton>
            </HStack>

            <TextInput
              multiline
              numberOfLines={6}
              placeholder="Notes"
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
        isOpen={rating !== 0}
        position="right"
        onClickOutside={() => {
          setRating(0)
        }}
        target={
          <div
            style={{
              filter: rating !== 0 ? '' : 'grayscale(100%)',
              marginLeft: 20,
            }}
          >
            <VStack>
              <TouchableOpacity
                onPress={() => {
                  if (rating == 1) return setRating(0)
                  setRating(1)
                }}
              >
                <Icon
                  name="chevron-up"
                  size={22}
                  color={rating === 1 ? 'green' : 'black'}
                  marginBottom={-5}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (rating == -1) return setRating(0)
                  setRating(-1)
                }}
              >
                <Icon
                  name="chevron-down"
                  size={22}
                  color={rating === -1 ? 'red' : 'black'}
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
