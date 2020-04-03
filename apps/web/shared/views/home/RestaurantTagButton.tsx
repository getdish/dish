import { Restaurant } from '@dish/models'
import _ from 'lodash'
import React, { memo, useState } from 'react'
import { Button, Text, TextInput, View } from 'react-native'

import { useOvermind } from '../../state/om'
import { Icon } from '../shared/Icon'
import { Popover } from '../shared/Popover'
import { SmallTitle, SmallerTitle } from '../shared/SmallTitle'
import { HStack, VStack } from '../shared/Stacks'
import { Tooltip } from '../shared/Tooltip'
import { styles } from './HomeRestaurantView'
import { HoverableButton } from './HoverableButton'
import { TagButton } from './TagButton'

export const RestaurantTagButton = memo(
  ({ restaurant, size }: { restaurant: Restaurant; size?: 'md' | 'lg' }) => {
    const om = useOvermind()
    const [isOpen, setIsOpen] = useState(false)
    const [suggested_tags, setSuggestedTags] = useState('')
    const isLarge = size == 'lg'
    return (
      <Popover
        overlay
        isOpen={isOpen}
        onClickOutside={() => setIsOpen(false)}
        position="right"
        contents={
          <Tooltip spacing maxWidth={300}>
            <SmallTitle>Tags</SmallTitle>
            <VStack padding={10} spacing="sm">
              {restaurant.tags.map((t, index) => {
                const name = t.taxonomy.name
                return (
                  <TagButton
                    key={`${name}${index}`}
                    size="lg"
                    rank={10}
                    name={name}
                    votable
                  />
                )
              })}
            </VStack>
            <SmallerTitle>Add tag</SmallerTitle>
            <HStack padding={10} flexWrap="wrap">
              {_.flatten((om.state.home.topDishes ?? []).map((x) => x.dishes))
                .filter(Boolean)
                .map((x, index) => (
                  <React.Fragment key={index}>
                    <View style={{ marginBottom: 6, marginRight: 6 }}>
                      <TagButton key={x.name} name={x.name} />
                    </View>
                  </React.Fragment>
                ))}
            </HStack>
            <HStack>
              <TextInput
                placeholder="Suggest tag"
                numberOfLines={1}
                style={styles.secondaryInput}
                onChangeText={(t: string) => {
                  setSuggestedTags(t)
                }}
              />
              <Button
                title="Add"
                onPress={async () => {
                  if (om.state.home.currentState.type != 'restaurant') return
                  await om.actions.home.suggestTags(suggested_tags)
                }}
              />
            </HStack>
          </Tooltip>
        }
      >
        <HoverableButton
          spacing={4}
          paddingHorizontal={5}
          paddingVertical={2}
          onPress={async () => {
            if (await om.actions.auth.ensureLoggedIn()) {
              setIsOpen(true)
            }
          }}
          margin={-4}
          borderRadius={10}
          // TODO make hoverable with onHoverIn
          hoverStyle={{
            backgroundColor: '#eee',
          }}
        >
          {isLarge ? '' : 'Add'}
          <Icon
            size={isLarge ? 26 : 14}
            marginBottom={-1}
            name="tag"
            color="blue"
          />
        </HoverableButton>
      </Popover>
    )
  }
)
