import { HomeStateItemBlog } from '../../../types/homeTypes'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Link } from '../../views/Link'
import { StackDrawer } from '../../views/StackDrawer'
import { HomeStackViewProps } from '../HomeStackViewProps'
import { PageContent } from '../PageContent'
import { useSnapToFullscreenOnMount } from '../restaurant/useSnapToFullscreenOnMount'
import { BlogPageDetail } from './BlogPageDetail'
import { BlogPostMeta } from './BlogPostMeta'
import { MDX } from './MDX'
import { Heading, Separator, Spacer, YStack } from '@dish/ui'
import React from 'react'

// import { posts } from './posts'
const posts = []

export default function BlogPage(props: HomeStackViewProps<HomeStateItemBlog>) {
  const slug = props.item.slug

  useSnapToFullscreenOnMount()

  return (
    <MDX>
      <StackDrawer closable title="Blog">
        <ContentScrollView id="blog">
          <PageContent>
            {!slug && <BlogPageIndex />}
            {!!slug && <BlogPageDetail post={posts[slug]} />}
          </PageContent>
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
      <YStack>
        <YStack paddingHorizontal={25} paddingVertical={40}>
          <Heading size="$8">Dish Blog</Heading>
        </YStack>
        <Separator />
        <YStack space="$6" paddingHorizontal={25} paddingVertical={40}>
          {allPosts.map((post, index) => (
            <YStack key={index} borderRadius={10} padding={10}>
              <Link name="blog" params={{ slug: post.id }}>
                <Heading selectable={false} textAlign="left" size="$4">
                  {post.title}
                </Heading>
              </Link>
              <Spacer size="$2" />
              <BlogPostMeta post={post} />
            </YStack>
          ))}
        </YStack>
      </YStack>
    </>
  )
}
