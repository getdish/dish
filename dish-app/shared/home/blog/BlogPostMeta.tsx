import React from 'react'
import { HStack, Paragraph } from 'snackui'

import { PostEntry } from './posts'

export const BlogPostMeta = ({ post }: { post: PostEntry }) => {
  return (
    <HStack alignItems="center">
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
    </HStack>
  )
}
