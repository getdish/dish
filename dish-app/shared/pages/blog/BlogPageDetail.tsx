import { Divider, Spacer, Title } from '@dish/ui'
import React from 'react'

import { posts } from './posts'

export function BlogPageDetail({ slug }: { slug: string }) {
  const { View, title } = posts[slug]
  return (
    <>
      <Title size="xl">{title}</Title>
      <Spacer size="xl" />
      <Divider />
      <Spacer size="lg" />
      <View />
    </>
  )
}
