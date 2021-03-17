import { SimpleText, View, ViewProps } from '@o/ui'
import React, { memo } from 'react'

import { Join } from './Join'

export const SignupForm = memo((props: ViewProps) => {
  return (
    <View
      sm-width="100%"
      md-width="80%"
      width="50%"
      abovemd-maxWidth={600}
      abovemd-minWidth={340}
      margin="auto"
      borderRadius={14}
      elevation={1}
      background={theme => theme.backgroundStrong}
      alignSelf="center"
      {...props}
    >
      <View padding={['lg', 'xxl']}>
        <Join
          header={
            <>
              <SimpleText
                textAlign="center"
                textTransform="uppercase"
                letterSpacing={1}
                alpha={0.6}
                size="xs"
              >
                Join the beta list
              </SimpleText>
            </>
          }
          space="md"
        />
      </View>
    </View>
  )
})
