import { graphql, listFindOne, listInsert, mutate, slugify } from '@dish/graph'
import { query } from '@dish/graph/src'
import { assertPresent, isPresent } from '@dish/helpers/src'
import { Edit2 } from '@dish/react-feather'
import { HistoryItem } from '@dish/router'
import React, { memo, useContext } from 'react'
import {
  AbsoluteVStack,
  HStack,
  Toast,
  Tooltip,
  VStack,
  useMedia,
} from 'snackui'

import { getActiveTags } from '../../../helpers/getActiveTags'
import { getFullTags } from '../../../helpers/getFullTags'
import { getTitleForState } from '../../../helpers/getTitleForState'
import { router } from '../../../router'
import { HomeStateItemSearch } from '../../../types/homeTypes'
import { useHomeStateById } from '../../homeStore'
import { useLastValueWhen } from '../../hooks/useLastValueWhen'
import { userStore } from '../../userStore'
import { SmallCircleButton } from '../../views/CloseButton'
import {
  ContentScrollViewHorizontalFitted,
  useContentScrollHorizontalFitter,
} from '../../views/ContentScrollViewHorizontal'
import { Link } from '../../views/Link'
import { ListCardHorizontal } from '../../views/list/ListCard'
import { SlantedTitle } from '../../views/SlantedTitle'
import { randomListColor } from '../list/listColors'
import { Arrow } from './Arrow'
import { SearchPagePropsContext, SearchPageTitle } from './SearchPage'
import { SearchPageScoring } from './SearchPageScoring'
import {
  getLocationFromRoute,
  useLocationFromRoute,
} from './useLocationFromRoute'

export const SearchHeader = () => {
  const { width, setWidthDebounce } = useContentScrollHorizontalFitter()
  const media = useMedia()
  return (
    <ContentScrollViewHorizontalFitted
      width={width}
      setWidth={setWidthDebounce}
    >
      <VStack>
        <VStack paddingTop={media.sm ? 12 : 12 + 52 + 10} />
        <HStack>
          <AbsoluteVStack zIndex={1000} top={5} left={5}>
            <SearchForkListButton />
          </AbsoluteVStack>
          <VStack width={width}>
            <SearchPageTitle />
            <SearchPageScoring />
          </VStack>
          <VStack marginBottom={8} position="relative">
            <AbsoluteVStack
              top={0}
              bottom={0}
              alignItems="center"
              justifyContent="center"
              left={-55}
            >
              <SlantedTitle size="xs">Lists</SlantedTitle>
              <AbsoluteVStack right={-14} transform={[{ rotate: '90deg' }]}>
                <Arrow />
              </AbsoluteVStack>
            </AbsoluteVStack>
            <SearchPageListsRow />
          </VStack>
        </HStack>
      </VStack>
    </ContentScrollViewHorizontalFitted>
  )
}

const SearchForkListButton = memo(() => {
  const curProps = useContext(SearchPagePropsContext)!
  const state = useHomeStateById<HomeStateItemSearch>(curProps.item.id)
  const { title, subTitle } = getTitleForState(state, {
    lowerCase: true,
  })
  const route = useLastValueWhen(
    () => router.curPage,
    router.curPage.name !== 'search'
  ) as HistoryItem<'search'>
  const location = useLocationFromRoute(route)
  const regionName = location.data?.region?.name
  const tooltip = `Make your "${title.replace('the ', '')}${
    regionName ? ` in ${regionName}` : ''
  }" list`
  return (
    <Tooltip contents={tooltip}>
      <Link
        promptLogin
        onPress={async () => {
          try {
            const { id, username } = userStore.user ?? {}
            assertPresent(id, 'no user id')
            assertPresent(username, 'no username')
            const name = `My ${title}`
            const slug = slugify(name)
            const location = await getLocationFromRoute(router.curPage as any)
            if (!location?.region) {
              console.warn('no region??????')
              return
            }
            const region = location.region.slug
            assertPresent(region, 'no region')
            const existing = await listFindOne(
              {
                slug,
                user_id: id,
                region,
              },
              {
                depth: 1,
              }
            )
            if (existing) {
              console.warn('go to existing')
              router.navigate({
                name: 'list',
                params: {
                  slug,
                  region,
                  userSlug: username,
                },
              })
              return
            }
            const [list] = await listInsert([
              {
                name,
                slug,
                region,
                description: subTitle,
                color: randomListColor(),
                user_id: id,
                location: null,
              },
            ])
            // now add tags to it
            const tags = await getFullTags(getActiveTags(state))
            if (tags.some((tag) => !tag.id)) {
              console.error(`no tag id??`, tags)
              debugger
              return
            }
            await mutate((mutation) => {
              return mutation.insert_list_tag({
                objects: tags.map((tag) => {
                  return {
                    list_id: list.id,
                    tag_id: tag.id,
                  }
                }),
              })?.__typename
            })
            router.navigate({
              name: 'list',
              params: {
                slug,
                region,
                userSlug: username,
              },
            })
          } catch (err) {
            // if this list already exists, we can just take them to it
            Toast.error(err.message)
            console.error(err)
          }
        }}
      >
        <SmallCircleButton shadowed>
          <Edit2 color="#fff" size={14} />
        </SmallCircleButton>
      </Link>
    </Tooltip>
  )
})

const SearchPageListsRow = memo(
  graphql((props: any) => {
    const curProps = useContext(SearchPagePropsContext)!
    const region = curProps.item.region

    if (!region) {
      return null
    }

    const tags = getActiveTags(curProps.item)
    const lists = query.list_populated({
      args: {
        min_items: 2,
      },
      where: {
        region: {
          _eq: region,
        },
        tags: {
          tag: {
            slug: {
              _in: tags.map((x) => x.slug).filter(isPresent),
            },
          },
        },
      },
    })

    return (
      <HStack
        height="100%"
        alignItems="center"
        justifyContent="center"
        spacing="md"
        paddingHorizontal={20}
      >
        {lists.map((list, i) => {
          return (
            <ListCardHorizontal
              key={i}
              slug={list.slug}
              userSlug={list.user?.username ?? ''}
              region={list.region ?? ''}
            />
          )
        })}
      </HStack>
    )
  })
)
