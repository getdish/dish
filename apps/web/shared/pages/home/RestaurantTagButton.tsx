import { Restaurant } from '@dish/graph'
import {
  Box,
  HStack,
  Popover,
  SmallTitle,
  SmallerTitle,
  VStack,
} from '@dish/ui'
import _ from 'lodash'
import React, { memo, useState } from 'react'
import { Tag } from 'react-feather'
import { Button, StyleSheet, TextInput, View } from 'react-native'

import { useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../../views/ui/LinkButton'
import { TagButton, getTagButtonProps } from './TagButton'

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
        onChangeOpen={setIsOpen}
        position="right"
        contents={
          <Box spacing maxWidth={300} maxHeight="90vh">
            <SmallTitle>Tags</SmallTitle>
            <VStack padding={10} spacing="sm">
              {restaurant.tags.map((t, index) => {
                const name = t.tag.name
                return (
                  <TagButton
                    key={`${name}${index}`}
                    size="lg"
                    rank={10}
                    votable
                    replace
                    {...getTagButtonProps(t.tag)}
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
                      <TagButton
                        key={x.name}
                        type="dish"
                        name={x.name ?? ''}
                        icon=""
                        rgb={[0, 0, 0]}
                      />
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
          </Box>
        }
      >
        <LinkButton
          spacing={4}
          paddingHorizontal={5}
          paddingVertical={2}
          onPress={async () => {
            if (await om.actions.user.ensureLoggedIn()) {
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
          <Tag
            size={isLarge ? 26 : 14}
            opacity={0.4}
            style={{ marginBottom: -1 }}
          />
        </LinkButton>
      </Popover>
    )
  }
)

const styles = StyleSheet.create({
  secondaryInput: {
    backgroundColor: '#eee',
    color: '#999',
    minWidth: 200,
    fontWeight: '500',
    padding: 8,
    borderRadius: 5,
    fontSize: 14,
  },
})
