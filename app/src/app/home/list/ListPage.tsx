import { series } from '@dish/async'
import { List, getUserName, graphql, listInsert, listUpdate, mutate, slugify } from '@dish/graph'
import { assertPresent } from '@dish/helpers'
import { List as ListIcon, Move, Plus, Trash, X } from '@dish/react-feather'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, Switch } from 'react-native'
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'
import { FlatList } from 'react-native-gesture-handler'
import {
  AbsoluteVStack,
  Button,
  HStack,
  Input,
  InteractiveContainer,
  Modal,
  Paragraph,
  Spacer,
  Text,
  Toast,
  VStack,
  useForceUpdate,
  useMedia,
  useTheme,
  useThemeName,
} from 'snackui'

import { red400 } from '../../../constants/colors'
import { isWeb } from '../../../constants/constants'
import { useRegionQuery } from '../../../helpers/fetchRegion'
import { getRestaurantIdentifiers } from '../../../helpers/getRestaurantIdentifiers'
import { getWindowHeight } from '../../../helpers/getWindow'
import { queryList } from '../../../queries/queryList'
import { router } from '../../../router'
import { HomeStateItemList } from '../../../types/homeTypes'
import { useSetAppMap } from '../../appMapStore'
import { homeStore, useHomeStateById } from '../../homeStore'
import { useStateSynced } from '../../hooks/useStateSynced'
import { useUserStore, userStore } from '../../userStore'
import { BottomFloatingArea } from '../../views/BottomFloatingArea'
import { CloseButton } from '../../views/CloseButton'
import { CommentBubble } from '../../views/CommentBubble'
import { ContentScrollView } from '../../views/ContentScrollView'
import { FavoriteButton } from '../../views/FavoriteButton'
import { Image } from '../../views/Image'
import { useListFavorite } from '../../views/list/useList'
import { PageHead } from '../../views/PageHead'
import { PaneControlButtons, PaneControlButtonsLeft } from '../../views/PaneControlButtons'
import { SmallButton } from '../../views/SmallButton'
import { StackDrawer } from '../../views/StackDrawer'
import { SuspenseFallback } from '../../views/SuspenseFallback'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { TitleStyled } from '../../views/TitleStyled'
import { getListPhoto } from '../getListPhoto'
import { StackItemProps } from '../HomeStackView'
import { ColorPicker } from './ColorPicker'
import { ListAddRestuarant } from './ListAddRestuarant'
import {
  listColors as allListColors,
  getListColors,
  randomListColor,
  useListColors,
} from './listColors'
import { ListItem } from './ListItem'
import { useListItems } from './useListItems'

type Props = StackItemProps<HomeStateItemList>

export default function ListPage(props: Props) {
  const item = useHomeStateById<HomeStateItemList>(props.item.id)
  const isCreating = item.slug === 'create'

  useEffect(() => {
    if (!isCreating) return
    const username = userStore.user?.username
    if (!username) {
      Toast.error(`No user`)
      return
    }
    // create a new list and redirect to it
    return series([
      () => fetch('/api/randomName').then((res) => res.text()),
      async (randomName) => {
        // assertIsString(userStore.user.id, 'expected user id')
        const [list] = await listInsert([
          {
            name: randomName,
            slug: slugify(randomName),
            region: homeStore.lastRegionSlug,
            user_id: userStore.user?.id ?? 'anon',
            color: randomListColor(),
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
            slug: list.slug,
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
          <VStack paddingBottom="50%" alignItems="center" justifyContent="center" flex={1}>
            <Paragraph opacity={0.5}>Creating...</Paragraph>
          </VStack>
        </StackDrawer>
      )}

      {!isCreating && (
        <StackDrawer closable>
          <ListPageContent {...props} item={item} />
        </StackDrawer>
      )}
    </>
  )
}

const ListPageContent = memo(
  graphql(
    (props: Props) => {
      const user = useUserStore()
      const isMyList = userStore.isAdmin || props.item.userSlug === slugify(user.user?.username)
      const [isSorting, setIsSorting] = useState(false)
      const [showAddModal, setShowAddModal] = useState(false)
      const draft = useRef<Partial<List>>({})
      const listQuery = queryList(props.item.slug)
      const { list, isFavorited, toggleFavorite, reviewsCount, refetch } = useListFavorite({
        query: listQuery,
        list: listQuery[0],
      })
      const [isEditing, setIsEditing] = useState(false)
      const listColorInitial = useListColors(list?.color)
      const [listColors, setListColors] = useStateSynced(listColorInitial)
      const [isPublic, setPublic] = useStateSynced(list?.public ?? true)
      const listItems = useListItems(list)
      const region = useRegionQuery(props.item.region)
      const forceUpdate = useForceUpdate()
      const isMinimal = !!list?.theme
      const listSlug = props.item.slug
      const themeName = useThemeName()

      // useAsyncEffect(async () => {
      //   await sleep(1000)
      //   forceUpdate()
      // }, [])

      const setTheme = async (val: number) => {
        console.log('setting theme to', val)
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
        results: listItems.items.flatMap((x) => x?.restaurant || []).map(getRestaurantIdentifiers),
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
              size="sm"
              {...getTagButtonProps(tag)}
              votable={isMyList}
            />
          )
        })

      const nameLen = (list.name || '').length
      const media = useMedia()
      const theme = useTheme()
      let fontSize = 1.5 * (nameLen > 40 ? 26 : nameLen > 30 ? 32 : nameLen > 24 ? 40 : 48)
      if (media.sm) {
        fontSize = fontSize * 0.8
      }
      fontSize = Math.round(fontSize)

      const renderItem = useCallback(
        ({ item, index = 0, drag, isActive }: RenderItemParams<any>) => {
          const { restaurantId, restaurant, dishSlugs, position, list_restaurant } = item
          const content = (
            <ListItem
              list={list}
              restaurant={restaurant}
              listSlug={listSlug}
              minimal={isMinimal || isSorting}
              rank={index + 1}
              hideRate
              editable={isEditing || isMyList}
              username={username}
              listColors={listColors}
              onDelete={() => {
                if (confirm('Delete item?')) {
                  listItems.delete(restaurant.id)
                }
              }}
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
        [isMyList, isEditing, isSorting, isMinimal, list, listColors]
      )

      const ListViewElement = isSorting ? DraggableFlatList : FlatList

      const titleColors = {
        color: listColors.colorForTheme,
        backgroundColor: listColors.backgroundForTheme,
      }

      console.log('rener??')

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
                elevation={3}
                noTextWrap
                onPress={() => {
                  setShowAddModal(true)
                }}
              >
                <Plus size={20} color="#888" />
              </Button>
              <VStack pointerEvents="none" flex={1} />
            </BottomFloatingArea>
          )}

          {isMyList && (
            <Modal
              visible={showAddModal}
              onDismiss={() => setShowAddModal(false)}
              width={380}
              flex={1}
              height="90%"
              minHeight={480}
            >
              {showAddModal && (
                <>
                  <PaneControlButtons>
                    <CloseButton onPress={() => setShowAddModal(false)} />
                  </PaneControlButtons>
                  <SuspenseFallback>
                    <ListAddRestuarant listSlug={listSlug} onAdd={listItems.add} />
                  </SuspenseFallback>
                </>
              )}
            </Modal>
          )}

          <ContentScrollView id="list">
            <AbsoluteVStack
              fullscreen
              zIndex={0}
              backgroundColor={listColors.backgroundForTheme}
              opacity={0.25}
            />
            <>
              <PaneControlButtonsLeft>
                <FavoriteButton floating isFavorite={isFavorited} onToggle={toggleFavorite}>
                  {reviewsCount}
                </FavoriteButton>

                {isMyList && !isEditing && (
                  <SmallButton elevation={1} onPress={() => setIsEditing(true)}>
                    Edit
                  </SmallButton>
                )}

                {isMyList && (
                  <SmallButton
                    icon={isSorting ? null : <ListIcon size={16} color="#888" />}
                    elevation={1}
                    themeInverse
                    onPress={() => setIsSorting((x) => !x)}
                  >
                    {isSorting ? 'Done' : 'Sort'}
                  </SmallButton>
                )}

                {isEditing && (
                  <>
                    <SmallButton
                      themeInverse
                      elevation={1}
                      onPress={async () => {
                        router.setRouteAlert(null)
                        setIsEditing(false)
                        await listUpdate(
                          {
                            id: list.id,
                            ...draft.current,
                            ...(listColors.backgroundColor && {
                              color: allListColors.indexOf(listColors.backgroundColor),
                            }),
                            public: isPublic,
                          },
                          {
                            query: list,
                          }
                        )
                        refetch()
                        Toast.show('Saved')
                      }}
                    >
                      Save
                    </SmallButton>

                    <Spacer />

                    <VStack
                      opacity={0.8}
                      hoverStyle={{
                        opacity: 1,
                      }}
                      padding={6}
                      onPress={() => {
                        setIsEditing(false)
                      }}
                    >
                      <X color={listColors.color} size={24} />
                    </VStack>
                    <Spacer size="lg" />
                  </>
                )}
              </PaneControlButtonsLeft>

              <VStack overflow="hidden" width="100%" minHeight={getWindowHeight()}>
                {/* START HEADER */}
                <VStack paddingBottom={5} position="relative">
                  {/* BACKGROUND */}
                  {/* <AbsoluteVStack
                    fullscreen
                    zIndex={-1}
                    backgroundColor={listColors.backgroundForTheme}
                    // opacity={0.05}
                  /> */}
                  <HStack paddingHorizontal={20}>
                    <AbsoluteVStack
                      overflow="hidden"
                      zIndex={-1}
                      borderRadius={1000}
                      bottom={50}
                      opacity={0.3}
                      right={-150}
                    >
                      <Image
                        source={{ uri: getListPhoto(list) }}
                        style={{ width: 400, height: 400 }}
                      />
                    </AbsoluteVStack>
                    <VStack
                      // maxWidth={660}
                      // minWidth={380}
                      alignItems="flex-start"
                      justifyContent="flex-end"
                      width="100%"
                      flex={1}
                    >
                      <VStack minHeight={75} flex={1} />
                      <VStack display={isWeb ? 'block' : 'flex'}>
                        <TitleStyled
                          {...titleColors}
                          lineHeight={fontSize * 1.3}
                          fontWeight="800"
                          fontSize={fontSize}
                          {...(isEditing && {
                            width: '100%',
                          })}
                        >
                          {isEditing ? (
                            <Input
                              fontSize={fontSize}
                              {...titleColors}
                              fontWeight="800"
                              width="100%"
                              textAlign="left"
                              defaultValue={list.name || ''}
                              onChangeText={(val) => {
                                draft.current.name = val
                              }}
                              multiline
                              numberOfLines={2}
                              marginVertical={-5}
                            />
                          ) : (
                            list.name?.trim() || ''
                          )}
                        </TitleStyled>
                      </VStack>
                      <Spacer />
                      <VStack
                        maxWidth={800}
                        alignSelf="center"
                        width="100%"
                        zIndex={100}
                        position="relative"
                        paddingHorizontal={10}
                      >
                        <CommentBubble
                          showChildren={!!(isEditing || list.description)}
                          color={listColors.color}
                          chromeless
                          paddingHorizontal={0}
                          marginLeft={-5}
                          date={list.created_at}
                          after={
                            <>
                              {!!tagButtons.length && (
                                <HStack spacing="sm" justifyContent="center">
                                  {tagButtons}
                                </HStack>
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
                              placeholder="..."
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
                                        paddingBottom={i < items.length - 1 ? 26 : 0}
                                        key={i}
                                        sizeLineHeight={1.1}
                                        size={i == 0 ? 'lg' : 'md'}
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

                        {isMyList && isSorting && (
                          <HStack spacing alignSelf="center">
                            <Move size={16} color={listColors.color} />
                            <Paragraph opacity={0.6} size="sm">
                              press and hold on any item to sort
                            </Paragraph>
                          </HStack>
                        )}
                      </VStack>
                    </VStack>
                  </HStack>

                  {isMyList && isEditing && (
                    <HStack
                      position="relative"
                      zIndex={1000}
                      marginTop={15}
                      alignItems="center"
                      justifyContent="center"
                    >
                      {isEditing && (
                        <HStack
                          backgroundColor={theme.backgroundColor}
                          padding={5}
                          paddingHorizontal={20}
                          borderRadius={100}
                          elevation={1}
                          alignItems="center"
                          flexWrap="wrap"
                          spacing="xxl"
                        >
                          <Paragraph>Color:</Paragraph>
                          <ColorPicker
                            colors={allListColors}
                            color={listColors.backgroundColor}
                            onChange={(backgroundColor) => {
                              const index = allListColors.indexOf(backgroundColor)
                              setListColors(getListColors(index, themeName))
                            }}
                          />
                          <InteractiveContainer alignItems="center">
                            <Paragraph
                              size="sm"
                              opacity={0.5}
                              onPress={() => {
                                setTheme(0)
                              }}
                              paddingVertical={6}
                              paddingHorizontal={12}
                            >
                              Full
                            </Paragraph>
                            <Switch
                              value={list.theme === 1}
                              onValueChange={(isOn) => {
                                console.log('?', isOn)
                                setTheme(isOn ? 1 : 0)
                              }}
                            />
                            <Paragraph
                              size="sm"
                              opacity={0.5}
                              onPress={() => {
                                setTheme(1)
                              }}
                              paddingVertical={6}
                              paddingHorizontal={12}
                            >
                              Minimal
                            </Paragraph>
                          </InteractiveContainer>
                          <HStack>
                            <Paragraph>Public:&nbsp;</Paragraph>
                            <Switch value={isPublic} onValueChange={setPublic} />
                          </HStack>
                          <SmallButton
                            tooltip="Delete"
                            icon={<Trash color={red400} size={20} />}
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
                        </HStack>
                      )}
                    </HStack>
                  )}
                </VStack>
                {/* END HEADER */}

                {!listItems.items.length && (
                  <VStack padding={20} margin={20} borderRadius={10}>
                    <Paragraph>Nothing on this list, yet.</Paragraph>
                  </VStack>
                )}

                <VStack flex={1}>
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
                </VStack>

                {isMyList && (
                  <>
                    <Spacer size="lg" />
                    <HStack paddingHorizontal={20}>
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
                    </HStack>
                    <Spacer size="xl" />
                  </>
                )}
              </VStack>

              <Spacer size="xxxl" />
            </>
          </ContentScrollView>
        </>
      )
    },
    {
      suspense: false,
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
