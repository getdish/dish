import { Divider, YStack, useTheme } from '@dish/ui'
import React from 'react'

import { HomeStateItemAccount } from '../../../types/homeTypes'
import { PasswordReset } from '../../AuthForm'
import { UserOnboard } from '../../UserOnboard'
import { ContentScrollView } from '../../views/ContentScrollView'
import { StackDrawer } from '../../views/StackDrawer'
import { HomeStackViewProps } from '../HomeStackViewProps'
import { PageContentWithFooter } from '../PageContentWithFooter'

export default function AccountPage(props: HomeStackViewProps<HomeStateItemAccount>) {
  const theme = useTheme()
  return (
    <StackDrawer closable title="Blog">
      <ContentScrollView id="blog">
        <PageContentWithFooter>
          <UserOnboard />

          <Divider />

          <YStack
            margin={20}
            padding={20}
            borderWidth={1}
            borderColor={theme.borderColor}
            borderRadius={20}
          >
            <PasswordReset />
          </YStack>
        </PageContentWithFooter>
      </ContentScrollView>
    </StackDrawer>
  )
}
