import { promote } from '../../../helpers/listHelpers'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { CloseButton } from '../../views/CloseButton'
import { PaneControlButtons } from '../../views/PaneControlButtons'
import { SlantedTitle } from '../../views/SlantedTitle'
import { graphql, restaurant_tag } from '@dish/graph'
import {
  Button,
  Circle,
  Input,
  Modal,
  Separator,
  Spacer,
  Theme,
  Title,
  XStack,
  YStack,
  useTheme,
} from '@dish/ui'
import { ChevronDown, ChevronUp, Edit, Plus, X } from '@tamagui/feather-icons'
import { sortBy } from 'lodash'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { Image, ScrollView } from 'react-native'

export type EditTagsProps = {
  restaurantSlug: string
  tagSlugs: string[]
  onChange?: (slugs: string[]) => any
}

export const EditRestaurantTagsButton = graphql((props: EditTagsProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const hide = useCallback(() => setIsOpen(false), [])
  return (
    <>
      <Button onPress={() => setIsOpen(true)} icon={<Edit size={16} color="#999" />} />
      <Modal visible={isOpen} maxWidth={480} width="90%" maxHeight="90%" onDismiss={hide}>
        {(isOpen) => (isOpen ? <EditTagsModal {...props} setIsOpen={setIsOpen} /> : null)}
      </Modal>
    </>
  )
})

const EditTagsModal = memo(
  ({
    restaurantSlug,
    tagSlugs,
    onChange,
    setIsOpen,
  }: EditTagsProps & {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  }) => {
    const [slugs, setSlugs] = useState<string[]>(tagSlugs)
    const [restaurant] = queryRestaurant(restaurantSlug)
    const theme = useTheme()

    if (!restaurant) {
      return null
    }

    const dishes = (() => {
      const items = slugs.map((slug) => {
        return restaurant.tags({
          where: {
            tag: {
              type: {
                _eq: 'dish',
              },
              slug: {
                _eq: slug,
              },
            },
          },
          limit: 1,
        })[0]
      })
      return sortBy(items, (x) => slugs.indexOf(x?.tag?.slug ?? ''))
    })()

    const restDishes = restaurant.tags({
      where: {
        tag: {
          type: {
            _eq: 'dish',
          },
          slug: {
            _nin: slugs,
          },
        },
      },
    })

    useEffect(() => {
      setSlugs(tagSlugs)
    }, [JSON.stringify(tagSlugs)])

    function getDishItem(dish?: restaurant_tag, before: any = null, after: any = null) {
      if (!dish) return null
      return (
        <XStack key={dish.tag?.slug} space padding={5} alignItems="center">
          {before}
          {!!dish.photos ? (
            <Image
              source={{ uri: dish.photos[0] }}
              style={{ width: 40, height: 40, borderRadius: 100 }}
            />
          ) : (
            <Circle backgroundColor="rgba(150,150,150,0.29)" size="$10" />
          )}
          <Title>{dish.tag?.name}</Title>
          <YStack flex={1} />
          {after}
        </XStack>
      )
    }

    return (
      <>
        <PaneControlButtons>
          <CloseButton onPress={() => setIsOpen(false)} />
        </PaneControlButtons>

        <SlantedTitle alignSelf="center" marginTop={-10}>
          {restaurant.name}
        </SlantedTitle>

        <Spacer />

        <YStack width="100%" flexShrink={0}>
          <Input backgroundColor={theme.bg2} marginHorizontal={20} placeholder="Search dishes..." />
        </YStack>

        <ScrollView style={{ width: '100%' }}>
          <YStack padding={18}>
            {dishes.map((dish, index) => {
              return getDishItem(
                dish,
                <YStack alignItems="center" justifyContent="center">
                  <YStack
                    padding={10}
                    onPress={() => {
                      const next = promote(slugs, index)
                      setSlugs(next)
                    }}
                  >
                    <ChevronUp size={16} color="rgba(150,150,150,0.9)" />
                  </YStack>
                  <YStack
                    padding={10}
                    onPress={() => {
                      const next = promote(slugs, index + 1)
                      setSlugs(next)
                    }}
                  >
                    <ChevronDown size={16} color="rgba(150,150,150,0.9)" />
                  </YStack>
                </YStack>,
                <YStack
                  padding={10}
                  onPress={() => {
                    const next = [...slugs]
                    next.splice(index, 1)
                    setSlugs(next)
                  }}
                >
                  <X size={16} color="#000" />
                </YStack>
              )
            })}

            <Spacer />
            <Separator />
            <Spacer />

            {restDishes.map((dish) => {
              dish.tag?.slug
              return getDishItem(
                dish,
                <YStack
                  padding={10}
                  onPress={() => {
                    if (dish.tag.slug) {
                      setSlugs([...slugs, dish.tag.slug])
                    }
                  }}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Plus size={16} color="rgba(150,150,150,0.9)" />
                </YStack>
              )
            })}
          </YStack>
        </ScrollView>

        <XStack flexShrink={0}>
          {/* @ts-expect-error */}
          <Theme name="active">
            <Button onPress={() => onChange?.(slugs)}>Save</Button>
          </Theme>
        </XStack>

        <Spacer />
      </>
    )
  }
)
