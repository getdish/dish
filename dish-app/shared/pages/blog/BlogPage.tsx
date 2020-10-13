import { Divider, Spacer, Title, VStack } from '@dish/ui'
import React from 'react'

import { bgLightLight } from '../../colors'
import { HomeStateItemBlog } from '../../state/home-types'
import { ContentScrollView } from '../../views/ContentScrollView'
import { StackDrawer } from '../../views/StackDrawer'
import { Link } from '../../views/ui/Link'
import { StackViewProps } from '../StackViewProps'
import { BlogPageDetail } from './BlogPageDetail'
import { BlogPostMeta } from './BlogPostMeta'
import { MDX } from './MDX'
import { posts } from './posts'

export default function BlogPage(props: StackViewProps<HomeStateItemBlog>) {
  const slug = props.item.slug
  return (
    <MDX>
      <StackDrawer closable title="Blog">
        <ContentScrollView id="blog" paddingTop={0}>
          {!slug && <BlogPageIndex />}
          {!!slug && <BlogPageDetail post={posts[slug]} />}
        </ContentScrollView>
      </StackDrawer>
    </MDX>
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
    <>
      <VStack>
        <VStack
          paddingHorizontal={25}
          paddingVertical={40}
          backgroundColor={bgLightLight}
        >
          <Title size="xl">Dish Blog</Title>
        </VStack>
        <Divider />
        <VStack spacing="lg" paddingHorizontal={25} paddingVertical={40}>
          {allPosts.map((post, index) => (
            <VStack
              key={index}
              borderRadius={10}
              padding={10}
              hoverStyle={{
                backgroundColor: bgLightLight,
              }}
            >
              <Link name="blog" params={{ slug: post.id }}>
                <Title selectable={false} textAlign="left" size="xs">
                  {post.title}
                </Title>
              </Link>
              <Spacer size="sm" />
              <BlogPostMeta post={post} />
            </VStack>
          ))}
        </VStack>
      </VStack>
    </>
  )
}
