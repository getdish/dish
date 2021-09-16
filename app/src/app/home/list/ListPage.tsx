import { series } from '@dish/async'
import { List, getUserName, graphql, listInsert, listUpdate, mutate, slugify } from '@dish/graph'
import { assertPresent } from '@dish/helpers'
import { Move, Plus, Trash, X } from '@dish/react-feather'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Pressable, Switch } from 'react-native'
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'
import {
  Button,
  HStack,
  Input,
  Modal,
  Paragraph,
  Spacer,
  Text,
  Theme,
  Title,
  Toast,
  VStack,
  useForceUpdate,
  useMedia,
  useTheme,
} from 'snackui'

import { grey, red400 } from '../../../constants/colors'
import { drawerWidthMax } from '../../../constants/constants'
import { useRegionQuery } from '../../../helpers/fetchRegion'
import { getRestaurantIdentifiers } from '../../../helpers/getRestaurantIdentifiers'
import { getWindowHeight, getWindowWidth } from '../../../helpers/getWindow'
import { router } from '../../../router'
import { HomeStateItemList } from '../../../types/homeTypes'
import { useSetAppMap } from '../../AppMap'
import { homeStore, useHomeStateById } from '../../homeStore'
import { useStateSynced } from '../../hooks/useStateSynced'
import { useUserStore, userStore } from '../../userStore'
import { BottomFloatingArea } from '../../views/BottomFloatingArea'
import { CloseButton } from '../../views/CloseButton'
import { CommentBubble } from '../../views/CommentBubble'
import { ContentScrollView } from '../../views/ContentScrollView'
import { FavoriteButton } from '../../views/FavoriteButton'
import { Link } from '../../views/Link'
import { useListFavorite } from '../../views/list/useList'
import { PageHead } from '../../views/PageHead'
import { PaneControlButtons, PaneControlButtonsLeft } from '../../views/PaneControlButtons'
import { SmallButton } from '../../views/SmallButton'
import { StackDrawer } from '../../views/StackDrawer'
import { SuspenseFallback } from '../../views/SuspenseFallback'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { StackItemProps } from '../HomeStackView'
import { useSnapToFullscreenOnMount } from '../restaurant/useSnapToFullscreenOnMount'
import { UserAvatar } from '../user/UserAvatar'
import { ColorPicker } from './ColorPicker'
import { ListAddRestuarant } from './ListAddRestuarant'
import { getListColors, listColors, randomListColor } from './listColors'
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

const setIsEditing = (val: boolean) => {
  router.navigate({
    name: 'list',
    replace: true,
    params: {
      ...router.curPage.params,
      state: val ? 'edit' : undefined,
    },
  })
  if (val === false) {
    router.setRouteAlert(null)
  }
}

enum ListTheme {
  modern = 'modern',
  minimal = 'minimal',
}

const listThemes = {
  0: ListTheme.modern,
  1: ListTheme.minimal,
} as const

const ListPageContent = memo(
  graphql(
    (props: Props) => {
      const user = useUserStore()
      const isMyList = userStore.isAdmin || props.item.userSlug === slugify(user.user?.username)
      const isEditing = props.item.state === 'edit'
      const [showAddModal, setShowAddModal] = useState(false)
      const draft = useRef<Partial<List>>({})
      const { list, isFavorited, toggleFavorite, reviewsCount, refetch } = useListFavorite({
        slug: props.item.slug,
      })
      const listColorsMemo = useMemo(() => getListColors(list?.color), [list?.color])
      const [colors, setColors] = useStateSynced(listColorsMemo)
      const [isPublic, setPublic] = useStateSynced(list?.public ?? true)
      const listItems = useListItems(list)
      // const [isLoaded, setIsLoaded] = useState(false)
      const region = useRegionQuery(props.item.region)
      // disable for now
      // const listThemeIndex = list.theme ?? 0
      const forceUpdate = useForceUpdate()
      const listTheme = listThemes[1] as ListTheme //listThemeIndex === 0 ? listThemes[0] :
      const listSlug = props.item.slug

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
        console.log('affectedRows', affectedRows)
        if (affectedRows) {
          Toast.show(`Saved`)
        } else {
          Toast.show(`Error saving`)
        }
        refetch()
      }

      useSnapToFullscreenOnMount()

      useSetAppMap({
        id: props.item.id,
        hideRegions: true,
        isActive: props.isActive,
        results: listItems.items.map((x) => x.restaurant).map(getRestaurantIdentifiers),
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
      let fontSize = nameLen > 38 ? 26 : nameLen > 30 ? 36 : nameLen > 22 ? 40 : 48
      if (media.sm) {
        fontSize = fontSize * 0.8
      }

      const titleContents = isEditing ? (
        <Input
          fontSize={fontSize}
          fontWeight="600"
          width="auto"
          textAlign="center"
          {...(listTheme === 'minimal' && {
            fontWeight: '400',
            width: '100%',
            textAlign: 'left',
          })}
          defaultValue={list.name || ''}
          onChangeText={(val) => {
            draft.current.name = val
          }}
          multiline
          marginVertical={-5}
        />
      ) : (
        list.name
      )
      const locationName = region.data?.name ?? props.item.region
      const isMinimal = listTheme === 'minimal'

      const userCommentEl = (
        <VStack
          width="100%"
          {...(!isMinimal && {
            maxWidth: Math.min(getWindowWidth(), drawerWidthMax) * 0.95,
          })}
        >
          <CommentBubble
            color={colors.color}
            chromeless={isMinimal}
            paddingHorizontal={isMinimal ? 0 : 20}
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
                numberOfLines={3}
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

          {isMyList && (
            <HStack spacing alignSelf="center">
              <Move size={16} color={colors.color} />
              <Paragraph opacity={0.8} size="sm">
                press and hold on any item to sort
              </Paragraph>
            </HStack>
          )}
        </VStack>
      )

      const listHeaderEl = (
        <Theme name={colors.isLight ? 'dark' : 'light'}>
          {/* START HEADER */}
          <VStack
            minHeight={isMinimal ? 260 : 40}
            paddingHorizontal={20}
            paddingBottom={20}
            position="relative"
            backgroundColor={colors.backgroundColor}
          >
            {isMinimal && (
              <>
                <HStack paddingHorizontal={20}>
                  <VStack
                    maxWidth={660}
                    minWidth={380}
                    alignItems="flex-start"
                    justifyContent="flex-end"
                    width="100%"
                    flex={1}
                  >
                    <VStack minHeight={90} flex={1} backgroundColor="red" />
                    <Title
                      color={colors.color}
                      lineHeight={fontSize * 1.4}
                      fontWeight="800"
                      fontSize={fontSize}
                      {...(isEditing && {
                        width: '100%',
                      })}
                    >
                      {titleContents} <Text opacity={0.5}>{locationName || ''}</Text>
                    </Title>
                    {userCommentEl}
                  </VStack>

                  {/* <VStack width={380} marginRight={-180}>
                    <RestaurantPhotosRow
                      height={270}
                      width={200}
                      floating
                      restaurant={listItems.items[0].restaurant}
                      max={2}
                    />
                  </VStack> */}
                </HStack>
              </>
            )}

            {listTheme === 'modern' && (
              <HStack
                paddingVertical={14}
                marginHorizontal="auto"
                alignItems="center"
                justifyContent="center"
                width="100%"
                maxWidth={680}
                zIndex={100}
                position="relative"
              >
                <HStack
                  flex={1}
                  maxWidth={media.notSm ? '90%' : '75%'}
                  minWidth={220}
                  alignItems="center"
                  justifyContent="center"
                  spacing
                >
                  <Link name="user" params={{ username }}>
                    <UserAvatar
                      size={52}
                      avatar={list.user?.avatar ?? ''}
                      charIndex={list.user?.charIndex ?? 0}
                    />
                  </Link>

                  <Text ellipse lineHeight={22} textAlign="left">
                    <Link name="user" params={{ username }}>
                      <Title size="sm" fontWeight="400" opacity={0.5}>
                        {list.user?.name || username || '...'}'s&nbsp;
                      </Title>
                    </Link>
                    <Title size="sm" fontWeight="800" zIndex={0}>
                      {titleContents}&nbsp;
                    </Title>
                    <Title size="sm" fontWeight="200" opacity={0.5}>
                      {locationName ?? ''}
                    </Title>
                  </Text>
                </HStack>
              </HStack>
            )}

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
                      colors={listColors}
                      color={colors.backgroundColor}
                      onChange={(backgroundColor) => {
                        const index = listColors.indexOf(backgroundColor)
                        setColors(getListColors(index))
                      }}
                    />
                    {/* <InteractiveContainer alignItems="center">
                      <Paragraph
                        size="sm"
                        opacity={0.5}
                        onPress={() => {
                          setTheme(0)
                        }}
                        paddingVertical={6}
                        paddingHorizontal={12}
                      >
                        Modern
                      </Paragraph>
                      <Switch
                        value={list.theme === 1}
                        onValueChange={(isOn) => {
                          console.log('?')
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
                    </InteractiveContainer> */}
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
        </Theme>
      )

      const renderItem = useCallback(
        ({ item, index = 0, drag, isActive }: RenderItemParams<any>) => {
          const { restaurantId, restaurant, dishSlugs, position, list_restaurant } = item
          const content = (
            <ListItem
              list={list}
              listTheme={listTheme}
              restaurant={restaurant}
              listSlug={listSlug}
              rank={index + 1}
              hideRate
              editable={isEditing || isMyList}
              username={username}
            />
          )

          if (!isMyList) {
            return content
          }

          return (
            <Pressable
              // style={{
              //   // height: 100,
              //   // backgroundColor: isActive ? 'red' : undefined,
              // }}
              onLongPress={drag}
            >
              {content}
            </Pressable>
          )
        },
        [isMyList, isEditing, listTheme]
      )

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
                elevation={1}
                noTextWrap
                onPress={() => {
                  setShowAddModal(true)
                }}
              >
                <Plus size={42} color="#777" />
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

          {listTheme === 'modern' ? listHeaderEl : null}

          <ContentScrollView bidirectional={listTheme === 'modern'} id="list">
            <>
              <PaneControlButtonsLeft>
                <FavoriteButton floating isFavorite={isFavorited} onToggle={toggleFavorite}>
                  {reviewsCount}
                </FavoriteButton>

                {!isEditing && (
                  <HStack alignItems="center" flexWrap="wrap" spacing>
                    <SmallButton elevation={1} onPress={() => setIsEditing(true)}>
                      Customize
                    </SmallButton>
                  </HStack>
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
                            ...(colors.backgroundColor && {
                              color: listColors.indexOf(colors.backgroundColor),
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
                      <X color={grey} size={24} />
                    </VStack>
                    <Spacer size="lg" />
                  </>
                )}
              </PaneControlButtonsLeft>
              <VStack width="100%" minHeight={getWindowHeight()}>
                {listTheme === 'modern' ? null : listHeaderEl}

                {listTheme === 'modern' ? userCommentEl : null}

                {!listItems.items.length && (
                  <VStack padding={20} margin={20} borderRadius={10}>
                    <Paragraph>Nothing on this list, yet.</Paragraph>
                  </VStack>
                )}

                <VStack flex={1}>
                  <DraggableFlatList
                    keyExtractor={(item, index) => `draggable-item-${item.key}-${isMyList}`}
                    data={listItems.items}
                    renderItem={renderItem}
                    onDragEnd={listItems.sort}
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

                <Spacer size="xxxl" />
              </VStack>
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
