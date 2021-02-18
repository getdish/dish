import { graphql } from '@dish/graph'
import { query } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import React, { memo, useContext } from 'react'
import { HStack } from 'snackui'

import { getActiveTags } from '../../../helpers/getActiveTags'
import { ListCardHorizontal } from '../../views/list/ListCard'
import { SearchPagePropsContext } from './SearchPagePropsContext'

export const SearchPageListsRow = memo(
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
