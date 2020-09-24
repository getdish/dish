import { Spacer, Title, VStack } from '@dish/ui'
import React from 'react'

import { HomeStateItemBlog } from '../../state/home-types'
import { ContentScrollView } from '../../views/ContentScrollView'
import { StackDrawer } from '../../views/StackDrawer'
import { Link } from '../../views/ui/Link'
import { StackViewProps } from '../StackViewProps'
import { BlogPageDetail } from './BlogPageDetail'
import { BlogPostMeta } from './BlogPostMeta'
import { posts } from './posts'

export default function BlogPage(props: StackViewProps<HomeStateItemBlog>) {
  const slug = props.item.slug
  return (
    <StackDrawer closable title="Blog">
      <ContentScrollView
        style={{
          paddingTop: 40,
          paddingHorizontal: '5%',
          paddingVertical: '5%',
          flex: 1,
        }}
      >
        {!slug && <BlogPageIndex />}
        {!!slug && <BlogPageDetail slug={slug} />}
      </ContentScrollView>
    </StackDrawer>
  )
}

function BlogPageIndex() {
  const allPosts = Object.keys(posts)
    .slice(0, 10)
    .map((id) => ({
      ...posts[id],
      id,
    }))
    .filter((x) => !x.private)
    .sort((a, b) =>
      new Date(a.date).getTime() > new Date(b.date).getTime() ? -1 : 1
    )

  return (
    <VStack spacing="xxl">
      <Title size="xl">Blog 🍛</Title>
      {allPosts.map((post, index) => (
        <VStack
          key={index}
          hoverStyle={{
            backgroundColor: `rgba(0,0,0,0.1)`,
          }}
        >
          <Link name="blog" params={{ slug: post.id }}>
            <Title selectable={false} textAlign="left" size="sm">
              {post.title}
            </Title>
          </Link>
          <Spacer size="sm" />
          <BlogPostMeta post={post} />
        </VStack>
      ))}
    </VStack>
  )
}
