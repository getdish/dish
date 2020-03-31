import { Restaurant } from '@dish/models'
import _ from 'lodash'
import React, { memo, useState } from 'react'
import { Button, Text, TextInput } from 'react-native'

import { useOvermind } from '../../state/om'
import { Icon } from '../shared/Icon'
import { Popover } from '../shared/Popover'
import { HStack } from '../shared/Stacks'
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
        position="right"
        contents={
          <Tooltip maxWidth={300}>
            <Text
              style={{
                padding: 10,
                paddingTop: 0,
                textAlign: 'center',
                width: '100%',
              }}
            >
              Tag
            </Text>
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
              ></Button>
            </HStack>
            <HStack padding={10} flexWrap="wrap">
              {restaurant.tags.map((t, index) => {
                const name = t.taxonomy.name
                return <TagButton key={`${name}${index}`} name={name} />
              })}
            </HStack>
            <Text
              style={{
                padding: 10,
                textAlign: 'center',
                width: '100%',
              }}
            >
              Top tags
            </Text>
            <HStack padding={10} flexWrap="wrap">
              {_.flatten(
                (om.state.home.lastHomeState.top_dishes ?? []).map(
                  (x) => x.dishes
                )
              )
                .filter(Boolean)
                .map((x, index) => (
                  <TagButton key={x.name} name={x.name} />
                ))}
            </HStack>
          </Tooltip>
        }
        isOpen={isOpen}
        onClickOutside={() => setIsOpen(false)}
      >
        <HoverableButton onPress={() => setIsOpen(true)} marginBottom={-4}>
          <Icon size={isLarge ? 26 : 16} name="tag" color="blue" />
        </HoverableButton>
      </Popover>
    )
  }
)
