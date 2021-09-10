import { series, sleep } from '@dish/async'
import {
  List,
  getUserName,
  graphql,
  listInsert,
  listUpdate,
  mutate,
  order_by,
  slugify,
} from '@dish/graph'
import { assertPresent } from '@dish/helpers'
import { Plus, Trash, X } from '@dish/react-feather'
import React, { Suspense, SuspenseList, memo, useEffect, useRef, useState } from 'react'
import { Image, StyleSheet, Switch } from 'react-native'
import {
  AbsoluteVStack,
  Button,
  HStack,
  Input,
  InteractiveContainer,
  LinearGradient,
  LoadingItem,
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

import { blue200, grey, red400 } from '../../../constants/colors'
import { drawerWidthMax } from '../../../constants/constants'
import { useRegionQuery } from '../../../helpers/fetchRegion'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { getRestaurantIdentifiers } from '../../../helpers/getRestaurantIdentifiers'
import { getWindowHeight, getWindowWidth } from '../../../helpers/getWindow'
import { useIsMounted } from '../../../helpers/useIsMountedRef'
import { router } from '../../../router'
import { HomeStateItemList } from '../../../types/homeTypes'
import { useSetAppMap } from '../../AppMap'
import { homeStore, useHomeStateById } from '../../homeStore'
import { useAsyncEffect } from '../../hooks/useAsync'
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
import { Score } from '../../views/Score'
import { SmallButton } from '../../views/SmallButton'
import { StackDrawer } from '../../views/StackDrawer'
import { SuspenseFallback } from '../../views/SuspenseFallback'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { StackItemProps } from '../HomeStackView'
import { CircleButton } from '../restaurant/CircleButton'
import { useSnapToFullscreenOnMount } from '../restaurant/useSnapToFullscreenOnMount'
import { UserAvatar } from '../user/UserAvatar'
import { ColorPicker } from './ColorPicker'
import { ListAddRestuarant } from './ListAddRestuarant'
import { getListColor, listColors, randomListColor } from './listColors'
import { ListItem } from './ListItem'
import { useListRestaurants } from './useListRestaurants'

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
        <StackDrawer closable title={`Create playlist`}>
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

const FallbackListItem = () => {
  const theme = useTheme()
  return (
    <VStack height={150} borderTopColor={theme.borderColorHover}>
      <LoadingItem />
    </VStack>
  )
}

const ListPageContent = memo(
  graphql(
    (props: Props) => {
      // const themeName = useThemeName()
      // const theme = useTheme()
      const user = useUserStore()
      const isMyList = props.item.userSlug === slugify(user.user?.username)
      const isEditing = props.item.state === 'edit'
      const [showAddModal, setShowAddModal] = useState(false)
      const draft = useRef<Partial<List>>({})
      const { list, isFavorited, toggleFavorite, reviewsCount, refetch } = useListFavorite({
        slug: props.item.slug,
      })
      const [color, setColor] = useStateSynced(getListColor(list?.color) ?? '#999999')
      const [isPublic, setPublic] = useStateSynced(list?.public ?? true)
      const { items, ...listActions } = useListRestaurants(list)
      const [isLoaded, setIsLoaded] = useState(false)
      // only show first ones to load images faster on initial load
      const restaurants = items.slice(0, isLoaded ? 100 : 2)
      const region = useRegionQuery(props.item.region)
      const listThemeIndex = list.theme ?? 0
      const forceUpdate = useForceUpdate()
      const listTheme = listThemeIndex === 0 ? listThemes[0] : listThemes[1]
      const listSlug = props.item.slug

      const isRestaurantLoaded = !!restaurants[0]?.id

      useAsyncEffect(
        async (mounted) => {
          if (isRestaurantLoaded) {
            // let images load roughly
            await sleep(500)
            if (!mounted()) return
            setIsLoaded(true)
          }
        },
        [isRestaurantLoaded]
      )

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

      useEffect(() => {
        if (!props.isActive) return
        homeStore.updateCurrentState<HomeStateItemList>('ListPage.color', {
          color,
        })
      }, [props.isActive, color])

      useEffect(() => {
        if (!props.isActive) {
          router.setRouteAlert(null)
          return
        }
        if (isEditing) {
          router.setRouteAlert({
            condition: () => true,
            message: `Cancel editing list and lose edits?`,
          })
          return () => {
            router.setRouteAlert(null)
          }
        }
      }, [props.isActive, isEditing])

      useSetAppMap({
        id: props.item.id,
        hideRegions: true,
        isActive: props.isActive,
        results: restaurants.map((x) => x.restaurant).map(getRestaurantIdentifiers),
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

      const username = list.user?.username || ''
      const userFullNameOrUsername = getUserName(list.user)

      const tagButtons = list
        .tags({ limit: 10 })
        .map((x) => x.tag!)
        .map((tag, i) => {
          return <TagButton key={tag?.slug ?? i} size="sm" {...getTagButtonProps(tag)} />
        })

      const titleContents = isEditing ? (
        <Input
          fontSize={20}
          fontWeight="600"
          width="auto"
          textAlign="center"
          {...(listTheme === 'minimal' && {
            fontSize: 30,
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
      const media = useMedia()
      const theme = useTheme()
      const isMinimal = listTheme === 'minimal'

      const uri = [
        list.image || '',
        ...(list
          .restaurants({
            limit: 3,
            order_by: [{ position: order_by.asc }],
          })
          .map((x) => x.restaurant.image) || ''),
      ].find(Boolean)

      const userCommentEl = (isEditing || list.description) && (
        <VStack
          marginBottom={10}
          width="100%"
          paddingVertical={20}
          maxWidth={media.sm ? '100%' : '80%'}
          marginTop={-5}
          {...(!isMinimal && {
            maxWidth: Math.min(getWindowWidth(), drawerWidthMax) * 0.95,
          })}
          {...(isMinimal && {
            marginBottom: isEditing ? 20 : list.description ? 20 : -20,
          })}
        >
          <CommentBubble
            chromeless={isMinimal}
            paddingHorizontal={isMinimal ? 0 : 20}
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
        </VStack>
      )

      const listHeaderEl = (
        <>
          {/* START HEADER */}
          <Theme name={isMinimal ? 'dark' : null}>
            <VStack
              minHeight={isMinimal ? 300 : 40}
              paddingHorizontal={20}
              position="relative"
              backgroundColor={`${color}11`}
            >
              {isMinimal && (
                <>
                  <VStack minHeight={20} flex={1} />

                  <AbsoluteVStack backgroundColor="#000" zIndex={-1} fullscreen overflow="hidden">
                    <Image
                      // @ts-ignore
                      source={{
                        uri: getImageUrl(`${uri || ''}`, 600, 450),
                      }}
                      style={{
                        width: '100%',
                        height: 450,
                      }}
                    />
                    <LinearGradient
                      // start={[0.1, 0]}
                      colors={[
                        'rgba(20,20,20,1)',
                        // 'rgba(20,20,20,0.2)',
                        'rgba(0,0,0,0.35)',
                      ].reverse()}
                      style={StyleSheet.absoluteFill}
                    />
                  </AbsoluteVStack>

                  <HStack paddingHorizontal={28}>
                    <VStack alignItems="flex-start" justifyContent="flex-end" width="100%" flex={1}>
                      <Spacer size={84} />
                      <Title
                        textShadowColor={theme.shadowColor}
                        textShadowRadius={2}
                        textShadowOffset={{ height: 1, width: 0 }}
                        size="xxl"
                        sizeLineHeight={0.76}
                        fontWeight="700"
                        {...(isEditing && {
                          width: '100%',
                        })}
                      >
                        {titleContents} <Text opacity={0.5}>{locationName || ''}</Text>
                      </Title>
                      <Spacer size="sm" />
                      {userCommentEl}
                      <Spacer size="sm" />
                    </VStack>
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

              {isMyList && (
                <HStack
                  position="relative"
                  zIndex={1000}
                  marginBottom={-25}
                  marginTop={-25}
                  alignItems="center"
                  justifyContent="center"
                >
                  {!isEditing && (
                    <HStack alignItems="center" flexWrap="wrap" spacing>
                      <SmallButton elevation={1} onPress={() => setIsEditing(true)}>
                        Customize
                      </SmallButton>
                      <SmallButton elevation={1} onPress={() => setShowAddModal(true)}>
                        Add
                      </SmallButton>
                    </HStack>
                  )}

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
                      <ColorPicker colors={listColors} color={color} onChange={setColor} />
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
          </Theme>
          {/* END HEADER */}
        </>
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
                borderWidth={2}
                borderColor={blue200}
                theme="active"
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
                <Plus size={42} color="#fff" />
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
                    <ListAddRestuarant listSlug={listSlug} onAdd={listActions.add} />
                  </SuspenseFallback>
                </>
              )}
            </Modal>
          )}

          <PaneControlButtonsLeft>
            <FavoriteButton floating isFavorite={isFavorited} onToggle={toggleFavorite}>
              {reviewsCount}
            </FavoriteButton>

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
                        ...(color !== '#999' && {
                          color: listColors.indexOf(color),
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

          {listTheme === 'modern' ? listHeaderEl : null}

          <ContentScrollView bidirectional={listTheme === 'modern'} id="list">
            <>
              <VStack minHeight={getWindowHeight()}>
                {listTheme === 'modern' ? null : listHeaderEl}

                {listTheme === 'modern' ? userCommentEl : null}

                {!restaurants.length && (
                  <VStack padding={20} margin={20} borderRadius={10}>
                    <Paragraph>Nothing on this list, yet.</Paragraph>
                  </VStack>
                )}

                <SuspenseList revealOrder="together">
                  {restaurants.map(
                    ({ restaurantId, restaurant, dishSlugs, position, list_restaurant }, index) => {
                      return (
                        <Suspense fallback={<FallbackListItem />} key={restaurant.slug}>
                          <HStack position="relative">
                            {/* {userStore.isAdmin && <Text>{restaurant.id}</Text>} */}
                            {isEditing && (
                              <AbsoluteVStack
                                zIndex={1000}
                                top={0}
                                left={0}
                                alignItems="center"
                                justifyContent="center"
                                spacing
                              >
                                <CircleButton
                                  backgroundColor={red400}
                                  width={40}
                                  height={40}
                                  onPress={() => {
                                    listActions.delete(restaurantId)
                                  }}
                                >
                                  <X size={20} color="#fff" />
                                </CircleButton>

                                <Score
                                  size="sm"
                                  votable
                                  upTooltip="Move up"
                                  downTooltip="Move down"
                                  score={index + 1}
                                  setVote={(vote) => {
                                    listActions.promote(vote === 1 ? index : index + 1)
                                  }}
                                />
                              </AbsoluteVStack>
                            )}
                            <ListItem
                              listTheme={listTheme}
                              restaurant={restaurant}
                              listSlug={listSlug}
                              rank={index + 1}
                              hideRate
                              // dishSlugs={dishSlugs.length ? dishSlugs : undefined}
                              editable={isEditing || isMyList}
                              username={username}
                              // onChangeDishes={async (dishes) => {
                              //   console.log('should change dishes', dishes)
                              //   await listActions.setDishes(restaurantId, dishes)
                              //   Toast.success(`Updated dishes`)
                              // }}
                              // onChangeDescription={async (next) => {
                              //   await listActions.setComment(restaurantId, next)
                              //   Toast.success('Updated description')
                              // }}
                            />
                          </HStack>
                          {/* <Spacer /> */}
                        </Suspense>
                      )
                    }
                  )}
                </SuspenseList>

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
                  </>
                )}
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
