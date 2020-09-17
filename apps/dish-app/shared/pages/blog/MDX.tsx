import { Spacer, Text, VStack } from '@dish/ui'
import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import { Image, ImageProps } from 'react-native'

import { Link } from '../../views/ui/Link'
import { Paragraph } from '../../views/ui/Paragraph'
import { contentSpace, contentSpaceLg } from './contentSpace'
import { IntroText } from './IntroText'

const Alt = (props) => (
  <Text
    marginTop={-16}
    marginBottom={16}
    fontSize="75%"
    opacity={0.5}
    {...props}
  />
)

const components = {
  IntroText: (props) => (
    <>
      <IntroText {...props} />
      {contentSpaceLg}
    </>
  ),

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

  // h1: H1,
  // h2: H2,
  // h3: H3,
  // h4: H4,
  // h5: H5,

  pre: (props) => <div {...props} />,

  li: (props) => (
    <>
      <li style={{ marginLeft: 26 }} {...props} />
      <Spacer size="sm" />
    </>
  ),
  ul: (props) => (
    <>
      <ul className="body-text" {...props} />
      {contentSpace}
    </>
  ),

  a: (props: any) => {
    return <Link {...props} />
  },

  ol: (props) => (
    <>
      <ol className="body-text" {...props} />
      {contentSpace}
    </>
  ),

  p: (props) => {
    return (
      <>
        <Paragraph
          className="body-text"
          margin={0}
          fontSize="inherit"
          lineHeight="inherit"
          alpha={0.9}
          {...props}
        />
        {contentSpace}
      </>
    )
  },

  description: (props) => (
    <>
      <Paragraph
        className="body-text"
        margin={0}
        {...props}
        fontSize="inherit"
        lineHeight="inherit"
      />
      {contentSpace}
    </>
  ),

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
    <MDXProvider
      {...props}
      components={
        props.components ? { ...components, ...props.components } : components
      }
    >
      {children}
    </MDXProvider>
  )
}
