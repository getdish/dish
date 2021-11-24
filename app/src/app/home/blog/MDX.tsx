import {
  H1,
  H2,
  H3,
  H4,
  H5,
  Paragraph,
  Text,
  UnorderedList,
  UnorderedListItem,
  YStack,
} from '@dish/ui'
import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import { Image, ImageProps } from 'react-native'

import { HighlightedText } from '../../views/HighlightedText'
import { Link } from '../../views/Link'
import { contentSpace, contentSpaceLg, contentSpaceSm } from './contentSpace'
import { IntroText } from './IntroText'

const spaceVertical = (Component: any, space?: any) => (props: any) =>
  (
    <>
      {space ?? contentSpace}
      <Component {...props} />
      {space ?? contentSpace}
    </>
  )

const Alt = spaceVertical((props) => (
  <Text marginTop={-16} marginBottom={16} fontSize="75%" opacity={0.5} {...props} />
))

const ParagraphSpaced = spaceVertical((props) => <Paragraph {...props} />)

const components = {
  IntroText: spaceVertical(IntroText),

  Alt,

  LargeImage: ({ alt, ...rest }: ImageProps & { alt?: string }) => (
    <>
      <YStack width="110%">
        <Image
          style={{
            width: '100%',
          }}
          {...rest}
        />
      </YStack>
      {!!alt && <Alt>{alt}</Alt>}
      {contentSpaceLg}
    </>
  ),

  HighlightedText: spaceVertical(HighlightedText),

  Image: ({ alt, ...rest }: ImageProps & { alt?: string }) => (
    <>
      <Image
        style={{
          width: '100%',
          height: 'auto',
        }}
        {...rest}
      />
      {!!alt && <Alt>{alt}</Alt>}
    </>
  ),

  h1: spaceVertical(H1),
  h2: spaceVertical(H2),
  h3: spaceVertical(H3),
  h4: spaceVertical(H4),
  h5: spaceVertical(H5),
  pre: spaceVertical(Text),

  li: spaceVertical((props) => <UnorderedListItem {...props} />, contentSpaceSm),
  ul: spaceVertical((props) => <UnorderedList {...props} />),

  a: (props: any) => {
    return <Link display="inline" {...props} />
  },

  ol: spaceVertical((props) => <ol style={{ margin: 0 }} {...props} />),

  p: ParagraphSpaced,
  Paragraph: ParagraphSpaced,

  description: spaceVertical((props) => (
    <Paragraph
      className="body-text"
      margin={0}
      {...props}
      fontSize="inherit"
      lineHeight="inherit"
    />
  )),

  blockquote: (props) => (
    <YStack>
      {contentSpace}
      <Paragraph
        // padding={[12, 20, 0]}
        // margin={[0, 20]} // top/bottom wont work here
        // borderLeft={(theme) => [2, theme.borderColor]}
        fontSize="110%"
        lineHeight="inherit"
        // alpha={0.5}
        {...props}
      />
      {contentSpaceLg}
    </YStack>
  ),
}

export function MDX({ children, ...props }: any) {
  return (
    <MDXProvider {...props} components={components}>
      {children}
    </MDXProvider>
  )
}
