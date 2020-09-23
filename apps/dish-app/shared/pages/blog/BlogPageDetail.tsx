import { Title } from '@dish/ui'
import React from 'react'

import { MDX } from './MDX'
import { posts } from './posts'

export function BlogPageDetail({ slug }: { slug: string }) {
  const { View, title } = posts[slug]
  return (
    <MDX>
      <Title>{title}</Title>
      <View />
    </MDX>
  )
}
