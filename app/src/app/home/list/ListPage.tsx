import { isWeb } from '../../../constants/constants'
import { useRegionQuery } from '../../../helpers/fetchRegion'
import { getRestaurantIdentifiers } from '../../../helpers/getRestaurantIdentifiers'
import { getWindowHeight } from '../../../helpers/getWindow'
import { queryList } from '../../../queries/queryList'
import { router } from '../../../router'
import { HomeStateItemList } from '../../../types/homeTypes'
import { useSetAppMap } from '../../appMapStore'
import { homeStore, useHomeStateById } from '../../homeStore'
import { useListColor } from '../../hooks/useListColor'
import { useStateSynced } from '../../hooks/useStateSynced'
import { useUserStore, userStore } from '../../userStore'
import { BottomFloatingArea } from '../../views/BottomFloatingArea'
import { CommentBubble } from '../../views/CommentBubble'
import { FavoriteButton } from '../../views/FavoriteButton'
import { PageHead } from '../../views/PageHead'
import { PaneControlButtonsLeft } from '../../views/PaneControlButtons'
import { SmallButton } from '../../views/SmallButton'
import { StackDrawer } from '../../views/StackDrawer'
import { SuspenseFallback } from '../../views/SuspenseFallback'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { useListFavorite } from '../../views/list/useList'
import { StackItemProps } from '../HomeStackView'
import { RestaurantListItem } from '../restaurant/RestaurantListItem'
import { ColorPicker } from './ColorPicker'
import { ListAddRestuarant } from './ListAddRestuarant'
import { useListItems } from './useListItems'
import { series } from '@dish/async'
import {
  DISH_API_ENDPOINT,
  List,
  getUserName,
  graphql,
  listInsert,
  mutate,
  slugify,
} from '@dish/graph'
import { assertPresent } from '@dish/helpers'
import {
  Button,
  H1,
  Input,
  Modal,
  Paragraph,
  Spacer,
  Switch,
  Text,
  Theme,
  Toast,
  XStack,
  YStack,
  useForceUpdate,
  useMedia,
} from '@dish/ui'
import { List as ListIcon, Move, Plus, Trash } from '@tamagui/lucide-icons'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Pressable } from 'react-native'
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'

type Props = StackItemProps<HomeStateItemList>

export default function ListPage(props: Props) {
  const item = useHomeStateById<HomeStateItemList>(props.item.id)
  const isCreating = item.slug === 'create'
  const [list] = queryList(props.item.slug)
  const listColor = useListColor(list?.color)

  useEffect(() => {
    if (!isCreating) return
    const username = userStore.user?.username
    if (!username) {
      Toast.error(`No user`)
      return
    }
    // create a new list and redirect to it
    return series([
      async () => {
        try {
          const request = await fetch(`${DISH_API_ENDPOINT}/api/randomName`, {})
          if (request.status > 300) {
            return await request.text()
          }
        } finally {
          return `My List ${Math.round(Math.random() * 100_000_000)}`
        }
      },
      async (randomName) => {
        console.log('its', randomName)
        // assertIsString(userStore.user.id, 'expected user id')
        const [list] = await listInsert([
          {
            name: randomName,
            slug: slugify(randomName),
            region: homeStore.lastRegionSlug,
            user_id: userStore.user?.id ?? 'anon',
            color: 0, //randomListColor(),
          },
        ])
        return list
      },
      (list) => {
        if (!list) {
          Toast.error(`Error creating list`)
          return
        }
        router.navigate({
          name: 'list',
          replace: true,
          params: {
            userSlug: slugify(username),
            slug: list.slug || '',
            state: 'edit',
          },
        })
      },
    ])
  }, [isCreating])

  return (
    <>
      {isCreating && (
        <StackDrawer closable title={`Create list`}>
          <YStack paddingBottom="50%" alignItems="center" justifyContent="center" flex={1}>
            <Paragraph opacity={0.5}>Creating...</Paragraph>
          </YStack>
        </StackDrawer>
      )}

      {!isCreating && (
        <Theme name={listColor}>
          <StackDrawer closable>
            <ListPageContent {...props} item={item} />
          </StackDrawer>
        </Theme>
      )}
    </>
  )
}

const ListPageContent = memo(
  graphql(
    (props: Props) => {
      const user = useUserStore()
      const isMyList =
        userStore.isAdmin || props.item.userSlug === slugify(user.user?.username)
      const [isSorting, setIsSorting] = useState(false)
      const [showAddModal, setShowAddModal] = useState(false)
      const draft = useRef<Partial<List>>({})
      const listQuery = queryList(props.item.slug)
      const { list, isFavorited, toggleFavorite, reviewsCount, refetch } = useListFavorite({
        query: listQuery,
        list: listQuery[0],
      })
      const [isEditing, setIsEditing] = useState(false)
      const [listColors, setListColors] = useStateSynced(0)
      const [isPublic, setPublic] = useStateSynced(list?.public ?? true)
      const listItems = useListItems(list)
      const region = useRegionQuery(props.item.region)
      const forceUpdate = useForceUpdate()
      const isMinimal = !!list?.theme
      const listSlug = props.item.slug
      const listFont = list?.font || 0

      useEffect(() => {
        if (router.curPage.params.state === 'edit') {
          setIsEditing(true)
        }
      }, [])

      const setFont = async (val: number) => {
        list.font = val
        forceUpdate()
        const affectedRows = await mutate((mutation) => {
          return mutation.update_list({
            where: {
              id: {
                _eq: list.id,
              },
            },
            _set: {
              font: val,
            },
          })?.affected_rows
        })
        if (affectedRows) {
          Toast.show(`Saved`)
        } else {
          Toast.show(`Error saving`)
        }
        listItems.refetchAll()
      }

      const setTheme = async (val: number) => {
        list.theme = val
        forceUpdate()
        const affectedRows = await mutate((mutation) => {
          return mutation.update_list({
            where: {
              id: {
                _eq: list.id,
              },
            },
            _set: {
              theme: val,
            },
          })?.affected_rows
        })
        if (affectedRows) {
          Toast.show(`Saved`)
        } else {
          Toast.show(`Error saving`)
        }
        listItems.refetchAll()
      }

      // useSnapToFullscreenOnMount()

      useSetAppMap({
        id: props.item.id,
        hideRegions: true,
        isActive: props.isActive,
        results: listItems.items
          .flatMap((x) => x?.restaurant || [])
          .map(getRestaurantIdentifiers),
        showRank: true,
        zoomOnHover: true,
        fitToResults: true,
      })

      if (!list) {
        return (
          <StackDrawer closable title={`404`}>
            <Text>not found 😭</Text>
          </StackDrawer>
        )
      }

      const username = props.item.userSlug
      const userFullNameOrUsername = getUserName(list.user)

      const tagButtons = list
        .tags({ limit: 10 })
        .map((x) => x.tag!)
        .map((tag, i) => {
          return (
            <TagButton
              key={tag?.slug || i}
              size="$4"
              {...getTagButtonProps(tag)}
              votable={isMyList}
            />
          )
        })

      const nameLen = (list.name || '').length
      const media = useMedia()
      let fontSize = 1.5 * (nameLen > 40 ? 26 : nameLen > 30 ? 32 : nameLen > 24 ? 42 : 52)
      if (media.sm) {
        fontSize = fontSize * 0.8
      }
      fontSize = Math.round(fontSize)

      const renderItem = useCallback(
        ({ item, drag, isActive }: RenderItemParams<any>, index) => {
          const { restaurantId, restaurant, dishSlugs, position, list_restaurant } = item
          const content = (
            <RestaurantListItem
              // list={list
              curLocInfo={null}
              rank={0}
              restaurant={restaurant}
              // listSlug={listSlug}
              // minimal={isMinimal || isSorting}
              // rank={index + 1}
              // hideRate
              // editable={isEditing || isMyList}
              // username={username}
              // // listColors={listColors}
              // onDelete={() => {
              //   if (confirm('Delete item?')) {
              //     listItems.delete(restaurant.id)
              //   }
              // }}
            />
          )

          if (!isMyList) {
            return content
          }

          return (
            <Pressable
              style={
                isActive
                  ? {
                      shadowColor: '#000',
                      shadowRadius: 10,
                      shadowOffset: { height: 4, width: 0 },
                      shadowOpacity: 0.2,
                    }
                  : null
              }
              // style={{
              //   // height: 100,
              //   // backgroundColor: isActive ? 'red' : undefined,
              // }}
              delayLongPress={200}
              onLongPress={drag}
            >
              {content}
            </Pressable>
          )
        },
        [isMyList, isEditing, isSorting, isMinimal, list.theme, listFont]
      )

      // const ListViewElement = isSorting ? DraggableFlatList : FlatList
      const ListViewElement = DraggableFlatList

      // <Theme name={themeName === 'dark' ? `green-${themeName}` : 'green'}>
      return (
        <>
          <PageHead isActive={props.isActive}>{`${userFullNameOrUsername}'s ${list.name}${
            region.data?.name ? `in ${region.data.name}` : ''
          }`}</PageHead>

          {props.isActive && isMyList && (
            <BottomFloatingArea>
              <Button
                pointerEvents="auto"
                themeInverse
                borderRadius={100}
                width={55}
                height={55}
                alignItems="center"
                justifyContent="center"
                elevation="$3"
                noTextWrap
                onPress={() => {
                  setShowAddModal(true)
                }}
              >
                <Plus size={20} color="#888" />
              </Button>
              <YStack pointerEvents="none" flex={1} />
            </BottomFloatingArea>
          )}

          {isMyList && (
            <Modal open={showAddModal} onOpenChange={setShowAddModal} closable>
              {showAddModal && (
                <SuspenseFallback>
                  <ListAddRestuarant listSlug={listSlug} onAdd={listItems.add} />
                </SuspenseFallback>
              )}
            </Modal>
          )}

          <>
            <PaneControlButtonsLeft>
              <FavoriteButton size="$3" isFavorite={isFavorited} onToggle={toggleFavorite}>
                {reviewsCount}
              </FavoriteButton>

              {isMyList && (
                <SmallButton
                  icon={isSorting ? null : <ListIcon size={16} color="#888" />}
                  onPress={() => setIsSorting((x) => !x)}
                >
                  {isSorting ? 'Done' : 'Sort'}
                </SmallButton>
              )}
            </PaneControlButtonsLeft>

            <YStack overflow="hidden" width="100%" minHeight={getWindowHeight()}>
              {/* START HEADER */}
              <YStack paddingBottom={5} position="relative">
                <YStack paddingHorizontal={20}>
                  {/*
                      <Image
                        source={{ uri: getListPhoto(list) }}
                        style={{ width: 400, height: 400 }}
                      />*/}
                  <YStack
                    alignItems="flex-start"
                    justifyContent="flex-end"
                    width="100%"
                    flex={1}
                    py="$6"
                  >
                    <H1
                      color="$colorPress"
                      // fontFamily="$stylish"
                      size="$4"
                      als="center"
                      {...(isEditing && {
                        width: '100%',
                      })}
                    >
                      {isEditing ? (
                        <Input
                          size="$13"
                          fontFamily="$stylish"
                          width="100%"
                          textAlign="left"
                          defaultValue={list.name || ''}
                          padding={0}
                          bw={0}
                          onChangeText={(val) => {
                            draft.current.name = val
                          }}
                        />
                      ) : (
                        // `Cam's  ${list.name?.trim() || ''}`
                        `Cam's top island 💎`
                      )}
                    </H1>
                    <YStack
                      maxWidth={800}
                      alignSelf="center"
                      width="100%"
                      zIndex={100}
                      position="relative"
                    >
                      <CommentBubble
                        size="lg"
                        showChildren={!!(isEditing || list.description)}
                        // color={listColors.color}
                        chromeless
                        paddingHorizontal={0}
                        marginLeft={-5}
                        date={list.created_at}
                        after={
                          <>
                            {!!tagButtons.length && (
                              <YStack space="$2" justifyContent="center">
                                {tagButtons}
                              </YStack>
                            )}
                          </>
                        }
                        username={list.user?.username}
                        avatar={{
                          image: list.user?.avatar || '',
                          charIndex: list.user?.charIndex || 0,
                        }}
                        name={userFullNameOrUsername}
                      >
                        {isEditing ? (
                          <Input
                            placeholder="Write..."
                            multiline
                            numberOfLines={4}
                            lineHeight={30}
                            fontSize={20}
                            marginVertical={-10}
                            marginHorizontal={-15}
                            defaultValue={list.description ?? ''}
                            onChangeText={(val) => {
                              draft.current.description = val
                            }}
                          />
                        ) : (
                          (() => {
                            if (!list.description) {
                              return null
                            }
                            const items = list.description?.split('\n\n') ?? []
                            return (
                              <>
                                {items.map((x, i) => {
                                  return (
                                    <Paragraph
                                      userSelect="none"
                                      paddingBottom={i < items.length - 1 ? 26 : 0}
                                      key={i}
                                      size={i == 0 ? '$6' : '$4'}
                                    >
                                      {x}
                                    </Paragraph>
                                  )
                                })}
                              </>
                            )
                          })()
                        )}
                      </CommentBubble>
                    </YStack>
                  </YStack>
                </YStack>

                {isMyList && isSorting && (
                  <XStack
                    // fullscreen
                    // zi={10}
                    // bottom="auto"
                    pe="none"
                    py="$6"
                    space="$2"
                    alignSelf="center"
                    ai="center"
                    jc="center"
                  >
                    {/* listColors.color */}
                    <Move size={16} color={'red'} />
                    <Paragraph userSelect="none" opacity={0.6} size="$3">
                      press and hold on any item to sort
                    </Paragraph>
                  </XStack>
                )}

                {isMyList && isEditing && (
                  <YStack
                    position="relative"
                    zIndex={1000}
                    marginTop={15}
                    alignItems="center"
                    justifyContent="center"
                    pos="absolute"
                    t="$4"
                    r="$4"
                  >
                    <YStack
                      backgroundColor="$background"
                      padding={5}
                      paddingHorizontal={20}
                      borderRadius={100}
                      flex={1}
                      alignItems="center"
                      justifyContent="center"
                      flexWrap="wrap"
                      space="$8"
                    >
                      <YStack alignItems="center" space="$1">
                        <ColorPicker
                          // allListColors
                          colors={[]}
                          // listColors.backgroundColor
                          color={'red'}
                          onChange={(backgroundColor) => {
                            console.warn('tood')
                            // const index = allListColors.indexOf(backgroundColor)
                            // setListColors(getListColors(index, themeName))
                          }}
                        />
                      </YStack>

                      <YStack alignItems="center" space="$1">
                        <Paragraph>Public:&nbsp;</Paragraph>
                        <Switch checked={isPublic} onCheckedChange={setPublic} />
                      </YStack>
                      <SmallButton
                        tooltip="Delete"
                        icon={<Trash color="var(--red10)" size={20} />}
                        onPress={async () => {
                          assertPresent(list.id, 'no list id')
                          if (confirm('Permanently delete this list?')) {
                            router.setRouteAlert(null)
                            await mutate((mutation) => {
                              return mutation.delete_list({
                                where: {
                                  id: {
                                    _eq: list.id,
                                  },
                                },
                              })?.__typename
                            })
                            Toast.show('Deleted list')
                            homeStore.popBack()
                          }
                        }}
                      />
                    </YStack>
                  </YStack>
                )}
              </YStack>
              {/* END HEADER */}

              {!listItems.items.length && (
                <YStack padding={20} margin={20} borderRadius={10}>
                  <Paragraph>Nothing on this list, yet.</Paragraph>
                </YStack>
              )}

              <YStack flex={1}>
                <ListViewElement
                  keyExtractor={(item, index) => `draggable-item-${item?.key}-${isMyList}`}
                  data={listItems.items}
                  // @ts-ignore
                  renderItem={renderItem}
                  onDragBegin={() => {
                    if (isWeb) {
                      window.getSelection?.()?.empty?.()
                      window.getSelection?.()?.removeAllRanges?.()
                      document.body.classList.add('unselectable-all')
                    }
                  }}
                  onDragEnd={(items) => {
                    listItems.sort(items)
                    if (isWeb) {
                      document.body.classList.remove('unselectable-all')
                    }
                  }}
                />
              </YStack>

              {isMyList && (
                <>
                  <Spacer size="$6" />
                  <YStack paddingHorizontal={20}>
                    <Button
                      onPress={() => {
                        setShowAddModal(true)
                      }}
                      icon={<Plus size={16} color="rgba(150,150,150,0.8)" />}
                      paddingVertical={16}
                      paddingHorizontal={28}
                      textProps={{
                        fontSize: 18,
                      }}
                    >
                      Add
                    </Button>
                  </YStack>
                  <Spacer size="$8" />
                </>
              )}
            </YStack>

            <YStack width={1} height={media.sm ? 600 : 300} />
          </>
        </>
      )
    },
    {
      suspense: true,
    }
  )
)

// useEffect(() => {
//   if (!props.isActive) {
//     router.setRouteAlert(null)
//     return
//   }
//   if (isEditing) {
//     // no need, we have only one case where it can lose edits as not much
//     // router.setRouteAlert({
//     //   condition: () => true,
//     //   message: `Cancel editing list and lose edits?`,
//     // })
//     // return () => {
//     //   router.setRouteAlert(null)
//     // }
//   }
// }, [props.isActive, isEditing])
