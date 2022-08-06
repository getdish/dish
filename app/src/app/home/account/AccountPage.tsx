import { HomeStateItemAccount } from '../../../types/homeTypes'
import { PasswordReset } from '../../AuthForm'
import { UserOnboard } from '../../UserOnboard'
import { StackDrawer } from '../../views/StackDrawer'
import { HomeStackViewProps } from '../HomeStackViewProps'
import { PageContent } from '../PageContent'
import { useSnapToFullscreenOnMount } from '../restaurant/useSnapToFullscreenOnMount'
import { Separator, Spacer, YStack, useTheme } from '@dish/ui'
import React from 'react'

export default function AccountPage(props: HomeStackViewProps<HomeStateItemAccount>) {
  const theme = useTheme()

  useSnapToFullscreenOnMount()

  return (
    <StackDrawer closable title="Blog">
      <PageContent>
        <Spacer size="$8" />

        <UserOnboard hideLogo />

        <Separator />

        <YStack
          margin={20}
          padding={20}
          borderWidth={1}
          borderColor={theme.borderColor}
          borderRadius={20}
        >
          <PasswordReset />
        </YStack>
      </PageContent>
    </StackDrawer>
  )
}
