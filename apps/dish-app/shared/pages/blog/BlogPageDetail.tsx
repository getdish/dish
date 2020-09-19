import React from 'react'

import { Title } from '../../views/ui/Title'
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
