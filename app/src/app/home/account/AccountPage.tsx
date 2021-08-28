import React from 'react'
import { Divider, VStack, useTheme } from 'snackui'

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

          <VStack
            margin={20}
            padding={20}
            borderWidth={1}
            borderColor={theme.borderColor}
            borderRadius={20}
          >
            <PasswordReset />
          </VStack>
        </PageContentWithFooter>
      </ContentScrollView>
    </StackDrawer>
  )
}
