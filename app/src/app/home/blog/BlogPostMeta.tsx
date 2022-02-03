import { Paragraph, XStack } from '@dish/ui'
import React from 'react'

import { PostEntry } from './posts'

export const BlogPostMeta = ({ post }: { post: PostEntry }) => {
  return (
    <XStack alignItems="center">
      {/* <Avatar size={28} src={post.authorImage} /> */}
      <Paragraph opacity={0.7}>
        {post.author.trim()}
        &nbsp;&nbsp;&middot;&nbsp;&nbsp;
        {new Date(post.date)
          .toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })
          .replace(/,.*,/, ',')
          .replace(/\//g, '·')
          .trim()}
      </Paragraph>
    </XStack>
  )
}
