import React from 'react'
import { Divider, Spacer, Title, VStack } from 'snackui'

import { HomeStateItemBlog } from '../../../types/homeTypes'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Link } from '../../views/Link'
import { StackDrawer } from '../../views/StackDrawer'
import { HomeStackViewProps } from '../HomeStackViewProps'
import { PageContentWithFooter } from '../PageContentWithFooter'
import { useSnapToFullscreenOnMount } from '../restaurant/useSnapToFullscreenOnMount'
import { BlogPageDetail } from './BlogPageDetail'
import { BlogPostMeta } from './BlogPostMeta'
import { MDX } from './MDX'

// import { posts } from './posts'
const posts = []

export default function BlogPage(props: HomeStackViewProps<HomeStateItemBlog>) {
  const slug = props.item.slug

  useSnapToFullscreenOnMount()

  return (
    <MDX>
      <StackDrawer closable title="Blog">
        <ContentScrollView id="blog">
          <PageContentWithFooter>
            {!slug && <BlogPageIndex />}
            {!!slug && <BlogPageDetail post={posts[slug]} />}
          </PageContentWithFooter>
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
    .sort((a, b) => (new Date(a.date).getTime() > new Date(b.date).getTime() ? -1 : 1))

  return (
    <>
      <VStack>
        <VStack paddingHorizontal={25} paddingVertical={40}>
          <Title size="xl">Dish Blog</Title>
        </VStack>
        <Divider />
        <VStack spacing="lg" paddingHorizontal={25} paddingVertical={40}>
          {allPosts.map((post, index) => (
            <VStack key={index} borderRadius={10} padding={10}>
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
