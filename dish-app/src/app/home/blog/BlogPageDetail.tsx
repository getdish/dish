import React from 'react'
import { Divider, Spacer, Title, VStack } from 'snackui'

import { SmallButton } from '../../views/SmallButton'
import { BlogPostMeta } from './BlogPostMeta'
import { PostEntry } from './posts'

export function BlogPageDetail({ post }: { post: PostEntry }) {
  const { View, title } = post
  return (
    <VStack paddingHorizontal={25} paddingVertical={20}>
      <SmallButton marginTop={-15} marginBottom={10} name="blog">
        Back to blog
      </SmallButton>
      <Title size="xxl" fontWeight="800">
        {title}
      </Title>
      <Spacer size="sm" />
      <BlogPostMeta post={post} />
      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />
      <View />
    </VStack>
  )
}
