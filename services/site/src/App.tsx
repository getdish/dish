// debug
import React from 'react'
import { defaultMediaQueries } from 'snackui'
import { StackProps } from 'snackui'
import { VStack } from 'snackui'
import { useMedia } from 'snackui'
import { Text } from 'snackui'

export const App = () => {
  return (
    <Container marginLeft="auto" marginRight="auto">
      <Text alignSelf="flex-end">hello world</Text>
    </Container>
  )
}

const Container = (props: StackProps) => {
  const media = useMedia()

  return (
    <VStack
      width="100%"
      maxWidth={1024}
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
