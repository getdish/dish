import { Spacer, VStack } from '@dish/ui'
import React from 'react'

import { PageContent } from '../../views/layout/PageContent'
import { Link } from '../../views/ui/Link'
import { Title } from '../../views/ui/Title'
import { HomeScrollView } from '../home/HomeScrollView'
import { HomeStackDrawer } from '../home/HomeStackDrawer'
import { BlogLayout } from './BlogLayout'
import { BlogPostMeta } from './BlogPostMeta'
import { MDX } from './MDX'
import { posts } from './posts'

export default function BlogPage() {
  const all = Object.keys(posts)
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
    <HomeStackDrawer closable title="Blog">
      <HomeScrollView
        style={{
          paddingTop: 40,
          paddingHorizontal: '5%',
          paddingVertical: '5%',
          flex: 1,
        }}
      >
        <VStack spacing="xxl">
          <Title size="xl">Blog 🍛</Title>
          {all.map((post, index) => (
            <VStack
              key={index}
              hoverStyle={{
                backgroundColor: `rgba(0,0,0,0.1)`,
              }}
            >
              <Link>
                <Title selectable={false} textAlign="left" size="sm">
                  {post.title}
                </Title>
              </Link>
              <Spacer size="sm" />
              <BlogPostMeta post={post} />
            </VStack>
          ))}
        </VStack>
      </HomeScrollView>
    </HomeStackDrawer>
  )

  return (
    <BlogLayout>
      <MDX>
        <VStack position="relative">
          <PageContent zIndex={2}>
            <Link href="/blog">
              <VStack padding={30} position="relative" cursor="pointer">
                <Title size="lg" cursor="pointer" fontWeight="100">
                  The Blog
                </Title>
              </VStack>
            </Link>
          </PageContent>
        </VStack>
        {all.map((post, index) => (
          <VStack
            key={index}
            hoverStyle={{
              backgroundColor: `rgba(0,0,0,0.1)`,
            }}
          >
            <Link>
              <Title selectable={false} textAlign="left" size="sm">
                {post.title}
              </Title>
            </Link>
            <Spacer size="sm" />
            <BlogPostMeta post={post} />
          </VStack>
        ))}
      </MDX>
    </BlogLayout>
  )
}
