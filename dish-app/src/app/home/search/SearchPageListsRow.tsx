import { graphql, query, useMetaState, useQuery } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import React, { Suspense, memo, useContext } from 'react'
import { HStack } from 'snackui'

import { getActiveTags } from '../../../helpers/getActiveTags'
import { ListCardHorizontal } from '../../views/list/ListCardHorizontal'
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
          _eq: region,
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
      <HStack
        height="100%"
        alignItems="center"
        justifyContent="center"
        spacing="md"
        paddingHorizontal={20}
      >
        <Suspense fallback={null}>
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
        </Suspense>

        <SearchForkListButton>
          {!lists.length ? 'No lists yet, create first' : 'Create list'}
        </SearchForkListButton>
      </HStack>
    )
  })
)
