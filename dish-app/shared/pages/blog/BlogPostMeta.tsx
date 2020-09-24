import { HStack, Text } from '@dish/ui'
import React from 'react'

export const BlogPostMeta = ({ post }) => {
  return (
    <HStack alignItems="center">
      {/* <Avatar size={28} src={post.authorImage} /> */}
      <Text opacity={0.5}>
        &nbsp; &nbsp;
        {post.author}
        &nbsp;&nbsp;&middot;&nbsp;&nbsp;
        {new Date(post.date)
          .toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })
          .replace(/,.*,/, ',')
          .replace(/\//g, '·')}{' '}
      </Text>
    </HStack>
  )
}
