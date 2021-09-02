import { series } from '@dish/async'
import { List, graphql, listInsert, listUpdate, mutate, slugify } from '@dish/graph'
import { assertPresent } from '@dish/helpers'
import { Plus, Trash, X } from '@dish/react-feather'
import React, { Suspense, SuspenseList, memo, useEffect, useRef, useState } from 'react'
import { Switch } from 'react-native'
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
  Title,
  Toast,
  VStack,
  useForceUpdate,
} from 'snackui'

import { grey, red400 } from '../../../constants/colors'
import { useRegionQuery } from '../../../helpers/fetchRegion'
import { getRestaurantIdentifiers } from '../../../helpers/getRestaurantIdentifiers'
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
import { Score } from '../../views/Score'
import { SmallButton } from '../../views/SmallButton'
import { StackDrawer } from '../../views/StackDrawer'
import { SuspenseFallback } from '../../views/SuspenseFallback'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { StackItemProps } from '../HomeStackView'
import { PageContentWithFooter } from '../PageContentWithFooter'
import { CircleButton } from '../restaurant/CircleButton'
import { useSnapToFullscreenOnMount } from '../restaurant/useSnapToFullscreenOnMount'
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
      const { items: restaurants, ...listActions } = useListRestaurants(list)

      const region = useRegionQuery(props.item.region)

      const listThemeIndex = list.theme ?? 0
      const forceUpdate = useForceUpdate()
      const listTheme = listThemes[listThemeIndex]
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
      const userFullNameOrUsername = username || list.user?.username || ''

      const tagButtons = list
        .tags({ limit: 10 })
        .map((x) => x.tag!)
        .map((tag, i) => {
          return <TagButton key={tag?.slug ?? i} size="sm" {...getTagButtonProps(tag)} />
        })

      const textColor = listTheme === 'minimal' ? color : '#999'
      const titleContents = isEditing ? (
        <Input
          fontSize={20}
          fontWeight="600"
          width="auto"
          textAlign="center"
          {...(listTheme === 'minimal' && {
            fontSize: 60,
            fontWeight: '400',
            width: '100%',
            textAlign: 'left',
          })}
          defaultValue={list.name || ''}
          onChangeText={(val) => {
            draft.current.name = val
          }}
          color={textColor}
          multiline
          marginVertical={-5}
        />
      ) : (
        list.name
      )
      const locationName = region.data?.name ?? props.item.region

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
                elevation={2}
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
                    <ListAddRestuarant listSlug={listSlug} onAdd={listActions.add} />
                  </SuspenseFallback>
                </>
              )}
            </Modal>
          )}

          <ContentScrollView id="list">
            <PageContentWithFooter>
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

              {/* overflow clip prevention with marginVerticals here */}
              {/* START HEADER */}
              <VStack backgroundColor={`${color}11`}>
                {listTheme === 'minimal' && (
                  <VStack
                    alignItems="flex-start"
                    justifyContent="flex-end"
                    width="100%"
                    paddingHorizontal={28}
                  >
                    <Spacer size={84} />
                    <Title
                      maxWidth={620}
                      width="100%"
                      size="xxxl"
                      sizeLineHeight={0.72}
                      color={textColor}
                    >
                      {titleContents} <Text opacity={0.5}>{locationName ?? 'anywhere'}</Text>
                    </Title>
                    <Spacer size="lg" />
                  </VStack>
                )}

                {listTheme === 'modern' && (
                  <HStack
                    paddingVertical={28}
                    marginHorizontal="auto"
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                  >
                    <HStack
                      flex={1}
                      maxWidth="75%"
                      minWidth={200}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text lineHeight={22} textAlign="center">
                        <Link name="user" params={{ username }}>
                          <Title size="sm" fontWeight="300" opacity={0.5}>
                            {username || '...'}'s&nbsp;
                          </Title>
                        </Link>
                        <Title size="sm" fontWeight="600" color={color} zIndex={0}>
                          {titleContents}&nbsp;
                        </Title>
                        <Title size="sm" fontWeight="300" opacity={0.5}>
                          {locationName ?? 'anywhere'}
                        </Title>
                      </Text>
                    </HStack>
                  </HStack>
                )}

                {!!(list.description || isEditing || listTheme === 'minimal') && (
                  <VStack
                    marginBottom={10}
                    marginTop={-5}
                    {...(listTheme === 'minimal' && {
                      marginBottom: isEditing ? 20 : list.description ? 20 : -20,
                    })}
                  >
                    <CommentBubble
                      chromeless={listTheme === 'minimal'}
                      paddingHorizontal={20}
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
                )}

                {isMyList && (
                  <HStack
                    position="relative"
                    zIndex={1000}
                    paddingBottom={10}
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
                      <HStack alignItems="center" flexWrap="wrap" spacing>
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

              {/* END HEADER */}

              <VStack minHeight={300}>
                {!restaurants.length && (
                  <VStack padding={20} margin={20} borderRadius={10}>
                    <Paragraph>Nothing on this list, yet.</Paragraph>
                  </VStack>
                )}

                <SuspenseList revealOrder="forwards">
                  {restaurants.map(
                    ({ restaurantId, restaurant, dishSlugs, position, list_restaurant }, index) => {
                      return (
                        <Suspense fallback={null} key={restaurant.slug}>
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
            </PageContentWithFooter>
          </ContentScrollView>
        </>
      )
    },
    {
      suspense: false,
    }
  )
)
