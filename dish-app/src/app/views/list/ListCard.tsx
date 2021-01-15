import React from 'react'

import { queryList } from '../../../queries/queryList'
import { Card } from '../../home/restaurant/Card'
import { Link } from '../Link'

export function ListCard({ slug }: { slug: string }) {
  const list = queryList(slug)

  return (
    <Link name="list" asyncClick params={{ slug }}>
      <Card hoverable title={list.name} />
    </Link>
  )
}
