import { listFindOne, listInsert, mutate, slugify } from '@dish/graph'
import { assertPresent } from '@dish/helpers'
import { Edit2 } from '@dish/react-feather'
import { HistoryItem } from '@dish/router'
import React, { Suspense, memo, useContext } from 'react'
import {
  AbsoluteVStack,
  HStack,
  Spacer,
  Text,
  Toast,
  Tooltip,
  VStack,
  useMedia,
} from 'snackui'

import { getActiveTags } from '../../../helpers/getActiveTags'
import { getFullTags } from '../../../helpers/getFullTags'
import { getTitleForState } from '../../../helpers/getTitleForState'
import { rgbString } from '../../../helpers/rgbString'
import { router } from '../../../router'
import { HomeStateItemSearch } from '../../../types/homeTypes'
import { useHomeStateById } from '../../homeStore'
import { useCurrentLenseColor } from '../../hooks/useCurrentLenseColor'
import { useLastValueWhen } from '../../hooks/useLastValueWhen'
import { userStore } from '../../userStore'
import { SmallCircleButton } from '../../views/CloseButton'
import {
  ContentScrollViewHorizontalFitted,
  useContentScrollHorizontalFitter,
} from '../../views/ContentScrollViewHorizontal'
import { Link } from '../../views/Link'
import { SlantedTitle } from '../../views/SlantedTitle'
import { randomListColor } from '../list/listColors'
import { PageTitle } from '../PageTitle'
import { Arrow } from './Arrow'
import { SearchPageListsRow } from './SearchPageListsRow'
import { SearchPagePropsContext } from './SearchPagePropsContext'
import { SearchPageResultsInfoBox } from './SearchPageResultsInfoBox'
import { SearchPageScoring } from './SearchPageScoring'
import {
  getLocationFromRoute,
  useLocationFromRoute,
} from './useLocationFromRoute'

export const SearchHeader = () => {
  const curProps = useContext(SearchPagePropsContext)!
  const { width, setWidthDebounce } = useContentScrollHorizontalFitter()
  const media = useMedia()
  return (
    <>
      <ContentScrollViewHorizontalFitted
        width={width}
        setWidth={setWidthDebounce}
      >
        <VStack width="100%">
          <VStack paddingTop={media.sm ? 12 : 12 + 52 + 10} />
          <HStack>
            <AbsoluteVStack zIndex={1000} top={5} left={5}>
              <SearchForkListButton />
            </AbsoluteVStack>
            <VStack>
              <SearchPageTitle />
              <SearchPageScoring />
            </VStack>
            <HStack marginBottom={8} position="relative">
              <VStack
                position="relative"
                alignItems="center"
                justifyContent="center"
                transform={[{ translateX: -10 }]}
              >
                <SlantedTitle size="xs">Lists</SlantedTitle>
                <AbsoluteVStack right={-14} transform={[{ rotate: '90deg' }]}>
                  <Arrow />
                </AbsoluteVStack>
              </VStack>

              <SearchPageListsRow />
            </HStack>
          </HStack>
        </VStack>
      </ContentScrollViewHorizontalFitted>
      <Suspense fallback={null}>
        <SearchPageResultsInfoBox state={curProps.item} />
      </Suspense>
    </>
  )
}

const SearchPageTitle = memo(() => {
  const curProps = useContext(SearchPagePropsContext)!
  const { title, subTitle } = getTitleForState(curProps.item, {
    lowerCase: true,
  })
  const lenseColor = useCurrentLenseColor()
  return (
    <>
      <SlantedTitle
        paddingHorizontal={20}
        backgroundColor={rgbString(lenseColor)}
        color="#fff"
        size="xl"
        fontWeight="800"
        minWidth={200}
        borderRadius={8}
      >
        <VStack alignItems="center">
          <Text>{title}</Text>
          <Spacer size="xl" />
          <Text position="absolute" bottom={0} fontSize={16} fontWeight="300">
            {subTitle}
          </Text>
        </VStack>
      </SlantedTitle>
    </>
  )
})

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
