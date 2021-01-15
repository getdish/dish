import { graphql } from '@dish/graph/src'
import React from 'react'

import { queryList } from '../../../queries/queryList'
import { Card } from '../../home/restaurant/Card'
import { Link } from '../Link'

export const ListCard = graphql(
  ({ slug, userSlug }: { slug: string; userSlug: string }) => {
    const [list] = queryList(slug)
    return (
      <Link name="list" asyncClick params={{ slug, userSlug }}>
        <Card hoverable title={list.name} />
      </Link>
    )
  }
)
