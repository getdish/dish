import { Separator, Spacer, Title, YStack } from '@dish/ui'
import React from 'react'

import { Link } from '../../views/Link'
import { NotFoundPage } from '../../views/NotFoundPage'
import { SmallButton } from '../../views/SmallButton'
import { BlogPostMeta } from './BlogPostMeta'
import { PostEntry } from './posts'

export function BlogPageDetail({ post }: { post: PostEntry }) {
  if (!post) {
    return <NotFoundPage />
  }
  const { View, title } = post
  return (
    <YStack paddingHorizontal={25} paddingVertical={20}>
      <Link name="blog">
        <SmallButton marginTop={-15} marginBottom={10}>
          Back to blog
        </SmallButton>
      </Link>
      <Title size="xxl" fontWeight="800">
        {title}
      </Title>
      <Spacer size="$2" />
      <BlogPostMeta post={post} />
      <Spacer size="$6" />
      <Separator />
      <Spacer size="$6" />
      <View />
    </YStack>
  )
}
