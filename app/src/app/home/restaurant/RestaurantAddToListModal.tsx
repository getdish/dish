import { queryRestaurant } from '../../../queries/queryRestaurant'
import { queryUser } from '../../../queries/queryUser'
import { userStore } from '../../userStore'
import { CloseButton } from '../../views/CloseButton'
import { Link } from '../../views/Link'
import { PaneControlButtons } from '../../views/PaneControlButtons'
import { SlantedTitle } from '../../views/SlantedTitle'
import { graphql, order_by, query, useMutation } from '@dish/graph'
import {
  AbsoluteYStack,
  Adapt,
  Button,
  Card,
  Dialog,
  Fieldset,
  Heading,
  Input,
  Label,
  Modal,
  Spacer,
  Text,
  Theme,
  Toast,
  Unspaced,
  XStack,
  YStack,
} from '@dish/ui'
import { Plus, X } from '@tamagui/lucide-icons'
import React from 'react'
import { ScrollView } from 'react-native'

export const RestaurantAddToListModal = graphql(
  ({ slug, onDismiss }: { slug: string; onDismiss: () => any }) => {
    const user = queryUser(userStore.user?.username ?? '')
    const [restaurant] = queryRestaurant(slug)
    if (!restaurant) {
      return null
    }
    if (!user) {
      console.log('no user')
      return null
    }
    const lists =
      user?.lists({
        limit: 20,
        order_by: [{ created_at: order_by.desc }],
      }) ?? []
    const restaurantId = restaurant.id
    const listsWithRestaurant = query.list({
      where: {
        user_id: {
          _eq: user.id,
        },
        restaurants: {
          restaurant_id: {
            _eq: restaurantId,
          },
        },
      },
    })

    const [mutation, status] = useMutation((x) => {}, {
      refetchQueries: [listsWithRestaurant],
      awaitRefetchQueries: true,
    })
    console.log('mutation', status)

    return (
      <Dialog modal>
        <Dialog.Trigger asChild>
          <Button>Edit Profile</Button>
        </Dialog.Trigger>

        <Adapt when="sm" platform="touch">
          <Dialog.Sheet modal dismissOnSnapToBottom>
            <Dialog.Sheet.Frame padding="$4">
              <Adapt.Contents />
            </Dialog.Sheet.Frame>
            <Dialog.Sheet.Overlay />
          </Dialog.Sheet>
        </Adapt>

        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="quick"
            o={0.5}
            enterStyle={{ o: 0 }}
            exitStyle={{ o: 0 }}
          />
          <Dialog.Content
            bordered
            elevate
            key="content"
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            scale={1}
            opacity={1}
            y={0}
          >
            <YStack space>
              <Dialog.Title>Add to list</Dialog.Title>
              <Dialog.Description>Add {restaurant.name} to...</Dialog.Description>

              <Fieldset space="$4" horizontal>
                <Label w={160} justifyContent="flex-end" htmlFor="name">
                  Name
                </Label>
                <Input f={1} id="name" defaultValue="Nate Wienert" />
              </Fieldset>

              <Fieldset space="$4" horizontal>
                <Label w={160} justifyContent="flex-end" htmlFor="username">
                  Username
                </Label>
                <Input f={1} id="username" defaultValue="@natebirdman" />
              </Fieldset>
              {lists.map((list) => {
                const listId = list.id
                const isAdded = listsWithRestaurant.some((x) => x.id === listId)
                return (
                  <Link
                    key={listId}
                    name="list"
                    params={{
                      slug: list.slug ?? '',
                      userSlug: userStore.user?.username ?? '',
                    }}
                    onPress={onDismiss}
                  >
                    <XStack paddingHorizontal={20} paddingVertical={3}>
                      <YStack flex={1}>
                        <Heading size="$5">{list?.name}</Heading>
                      </YStack>

                      {!isAdded && (
                        <Button
                          theme="active"
                          // TODO
                          borderRadius={1000}
                          icon={<Plus size={12} color="#fff" />}
                          onPress={async (e) => {
                            e.stopPropagation()
                            await mutation({
                              fn: (m) => {
                                return m.insert_list_restaurant_one({
                                  object: {
                                    restaurant_id: restaurantId,
                                    list_id: listId,
                                    user_id: user.id,
                                  },
                                })?.__typename
                              },
                            })
                            Toast.success(`Added!`)
                          }}
                        >
                          Add
                        </Button>
                      )}

                      {isAdded && (
                        <Button
                          icon={<X size={16} />}
                          onPress={async (e) => {
                            e.stopPropagation()
                            await mutation({
                              fn: (m) => {
                                return m.delete_list_restaurant_by_pk({
                                  list_id: listId,
                                  restaurant_id: restaurantId,
                                })?.__typename
                              },
                            })
                            Toast.success(`Removed`)
                          }}
                        />
                      )}
                    </XStack>
                  </Link>
                )
              })}

              <YStack ai="flex-end" mt="$2">
                <Dialog.Close asChild>
                  <Button theme="alt1" aria-label="Close">
                    Save changes
                  </Button>
                </Dialog.Close>
              </YStack>

              <Unspaced>
                <Dialog.Close asChild>
                  <Button pos="absolute" t="$4" r="$4" circular icon={X} />
                </Dialog.Close>
              </Unspaced>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    )
  }
)
