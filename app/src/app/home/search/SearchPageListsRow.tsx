import { graphql, query } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import React, { Suspense, memo, useContext } from 'react'
import { HStack } from 'snackui'

import { getActiveTags } from '../../../helpers/getActiveTags'
import { getInitialRegionSlug } from '../../initialRegionSlug'
import { ListCard } from '../../views/list/ListCard'
import { SearchForkListButton } from './SearchForkListButton'
import { SearchPagePropsContext } from './SearchPagePropsContext'

export const SearchPageListsRow = memo(
  graphql((_props: {}) => {
    const curProps = useContext(SearchPagePropsContext)!
    const region = curProps.item.region
    const tags = getActiveTags(curProps.item)
    const activeTags = tags.map((x) => x.slug).filter(isPresent)

    const lists = query.list_populated({
      args: {
        min_items: 2,
      },
      where: {
        region: {
          _eq: region || getInitialRegionSlug(),
        },
        tags: {
          tag: {
            slug: {
              _in: activeTags,
            },
          },
        },
      },
    })

    if (!region) {
      return null
    }

    return (
      <Suspense fallback={null}>
        <HStack
          height="100%"
          alignItems="center"
          justifyContent="center"
          spacing="md"
          paddingHorizontal={20}
        >
          {lists.map((list, i) => {
            return (
              <ListCard
                size="xs"
                key={i}
                slug={list.slug ?? ''}
                userSlug={list.user?.username ?? ''}
                flat
                colored
                // region={list.region ?? ''}
              />
            )
          })}

          <SearchForkListButton>{!lists.length ? 'Create' : 'Create list'}</SearchForkListButton>
        </HStack>
      </Suspense>
    )
  })
)
