import { getActiveTags } from '../../../helpers/getActiveTags'
import { getFullTags } from '../../../helpers/getFullTags'
import { getTitleForState } from '../../../helpers/getTitleForState'
import { router } from '../../../router'
import { HomeStateItemSearch } from '../../../types/homeTypes'
import { homeStore, useHomeStateById } from '../../homeStore'
import { useLastValueWhen } from '../../hooks/useLastValueWhen'
import { userStore } from '../../userStore'
import { SmallCircleButton } from '../../views/CloseButton'
import { Link } from '../../views/Link'
import { LinkButton } from '../../views/LinkButton'
import { SearchPagePropsContext } from './SearchPagePropsContext'
import { getLocationFromRoute, useLocationFromRoute } from './useLocationFromRoute'
import { listFindOne, listInsert, mutate, slugify } from '@dish/graph'
import { assertPresent } from '@dish/helpers'
import { HistoryItem } from '@dish/router'
import { Toast, TooltipSimple } from '@dish/ui'
import { Edit2 } from '@tamagui/lucide-icons'
import React, { memo, useContext } from 'react'

export const SearchForkListButton = memo(
  ({ size, children }: { size?: 'sm' | 'md'; children?: any }) => {
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
    const tooltip = `my ${title.replace('the ', '')} in ${
      regionName?.toLowerCase() ?? ''
    } list`
    const El = size === 'sm' ? Link : LinkButton
    return (
      <TooltipSimple label={tooltip}>
        <El
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
              const region =
                location?.region?.slug ??
                homeStore.lastHomeOrSearchState.region ??
                homeStore.lastHomeState.region ??
                'ca-san-francisco'
              const existing = await listFindOne(
                {
                  slug,
                  user_id: id,
                  // region,
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
                    userSlug: username,
                  },
                })
                return
              }
              const [list] = await listInsert([
                {
                  name,
                  slug,
                  // region,
                  description: subTitle,
                  color: 0, //randomListColor(),
                  user_id: id,
                  location: null,
                },
              ])
              // now add tags to it
              const tags = await getFullTags(getActiveTags(state))
              if (tags.some((tag) => !tag.id)) {
                console.error(`no tag id??`, tags)
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
          {size === 'sm' ? (
            <SmallCircleButton elevation="$1">
              <Edit2 color="#999" size={14} />
            </SmallCircleButton>
          ) : (
            children || 'Create list'
          )}
        </El>
      </TooltipSimple>
    )
  }
)
