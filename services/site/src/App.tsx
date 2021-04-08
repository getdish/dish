import './assets/font-gteesti/stylesheet.css'
import './site.css'

import React from 'react'
import { Paragraph, StackProps, VStack, defaultMediaQueries, useMedia } from 'snackui'

import { LogoVertical } from './LogoVertical'

export const App = () => {
  return (
    <Container paddingVertical={20} marginLeft="auto" marginRight="auto">
      <LogoVertical />
      <Paragraph>hello world</Paragraph>
    </Container>
  )
}

// TODO need to fix up
const Container = (props: StackProps) => {
  const media = useMedia()

  return (
    <VStack
      width="100%"
      maxWidth={1124}
      {...(media.sm && {
        maxWidth: defaultMediaQueries.sm.maxWidth,
      })}
      {...(media.md && {
        maxWidth: defaultMediaQueries.md.minWidth,
      })}
      {...props}
    />
  )
}
