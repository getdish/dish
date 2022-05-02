import { AppMenuContents } from './AppMenuContents'
import { AppMenuLinkButton } from './AppMenuLinkButton'
import { appMenuStore } from './AppMenuStore'
import { useUserStore } from './userStore'
import { Popover, SizableText, XStack } from '@dish/ui'
import { useStoreInstance } from '@dish/use-store'
import { Menu } from '@tamagui/feather-icons'
import React, { memo } from 'react'

export const AppMenuButton = memo(() => {
  const userStore = useUserStore()
  const appMenu = useStoreInstance(appMenuStore)
  const showUserMenu = appMenu.isVisible

  return (
    <XStack alignItems="center">
      <Popover placement="bottom" open={showUserMenu} onOpenChange={appMenu.setIsVisible}>
        <Popover.Trigger>
          <AppMenuLinkButton Icon={Menu} onPress={() => appMenu.setIsVisible(!showUserMenu)}>
            <SizableText display={userStore.isLoggedIn ? 'none' : 'flex'} $sm={{ display: 'none' }}>
              Signup
            </SizableText>
          </AppMenuLinkButton>
        </Popover.Trigger>
        <Popover.Content>
          <AppMenuContents hideUserMenu={appMenu.hide} />
        </Popover.Content>
      </Popover>
    </XStack>
  )
})
