import { listFindOne, listInsert, mutate, slugify } from '@dish/graph'
import { assertPresent } from '@dish/helpers'
import { Edit2 } from '@dish/react-feather'
import { HistoryItem } from '@dish/router'
import React, { memo, useContext } from 'react'
import { Toast, Tooltip } from 'snackui'

import { getActiveTags } from '../../../helpers/getActiveTags'
import { getFullTags } from '../../../helpers/getFullTags'
import { getTitleForState } from '../../../helpers/getTitleForState'
import { router } from '../../../router'
import { HomeStateItemSearch } from '../../../types/homeTypes'
import { useHomeStateById } from '../../homeStore'
import { useLastValueWhen } from '../../hooks/useLastValueWhen'
import { userStore } from '../../userStore'
import { SmallCircleButton } from '../../views/CloseButton'
import { Link } from '../../views/Link'
import { randomListColor } from '../list/listColors'
import { SearchPagePropsContext } from './SearchPagePropsContext'
import {
  getLocationFromRoute,
  useLocationFromRoute,
} from './useLocationFromRoute'

export const SearchForkListButton = memo(() => {
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
            if (userStore.promptLogin()) {
              return
            }
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
