import { Divider, Spacer, Title, VStack } from '@dish/ui'
import React from 'react'

import { SmallButton } from '../../views/ui/SmallButton'
import { BlogPostMeta } from './BlogPostMeta'
import { PostEntry } from './posts'

export function BlogPageDetail({ post }: { post: PostEntry }) {
  const { View, title } = post
  return (
    <VStack spacing paddingHorizontal={25} paddingVertical={40}>
      <SmallButton marginTop={-15} marginBottom={10} name="blog">
        Back to blog
      </SmallButton>
      <Title size="lg">{title}</Title>
      <BlogPostMeta post={post} />
      <Spacer size="sm" />
      <Divider />
      <View />
    </VStack>
  )
}
