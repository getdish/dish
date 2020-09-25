import { H1, H2, H3, H4, H5, Paragraph, Text, VStack } from '@dish/ui'
import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import { Image, ImageProps } from 'react-native'

import { lightYellow, yellow } from '../../colors'
import { Link } from '../../views/ui/Link'
import { contentSpace, contentSpaceLg } from './contentSpace'
import { IntroText } from './IntroText'

const spaceVertical = (Component: any, space?: any) => (props: any) => (
  <>
    {space ?? contentSpace}
    <Component {...props} />
    {space ?? contentSpace}
  </>
)

const Alt = spaceVertical((props) => (
  <Text
    marginTop={-16}
    marginBottom={16}
    fontSize="75%"
    opacity={0.5}
    {...props}
  />
))

const ParagraphSpaced = spaceVertical((props) => (
  <Paragraph sizeLineHeight={1.1} {...props} />
))

const components = {
  IntroText: spaceVertical(IntroText),

  Alt,

  LargeImage: ({ alt, ...rest }: ImageProps & { alt?: string }) => (
    <>
      <VStack
        width="110%"
        margin="20px -5%"
        md-margin={[20, -20]}
        md-width="calc(100% + 40px)"
      >
        <Image
          style={{
            width: '100%',
          }}
          {...rest}
        />
      </VStack>
      {!!alt && <Alt>{alt}</Alt>}
      {contentSpaceLg}
    </>
  ),

  HighlightedText: spaceVertical((props) => (
    <Paragraph
      marginHorizontal={20}
      backgroundColor={lightYellow}
      borderColor={yellow}
      borderWidth={1}
      borderRadius={10}
      padding={20}
      {...props}
    />
  )),

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

  li: spaceVertical((props) => <li style={{ marginLeft: 26 }} {...props} />),
  ul: spaceVertical((props) => <ul style={{ margin: 0 }} {...props} />),

  a: spaceVertical((props: any) => {
    return <Link {...props} />
  }),

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
    <VStack>
      {contentSpace}
      <Paragraph
        padding={[12, 20, 0]}
        margin={[0, 20]} // top/bottom wont work here
        borderLeft={(theme) => [2, theme.borderColor]}
        fontSize="110%"
        lineHeight="inherit"
        alpha={0.5}
        {...props}
      />
      {contentSpaceLg}
    </VStack>
  ),
}

export function MDX({ children, ...props }: any) {
  return (
    <MDXProvider {...props} components={components}>
      {children}
    </MDXProvider>
  )
}
