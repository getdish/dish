import { Popover, Text, Theme, XStack, useMedia } from '@dish/ui'
import { useStoreInstance } from '@dish/use-store'
import { Menu } from '@tamagui/feather-icons'
import React, { memo } from 'react'

import { AppMenuContents } from './AppMenuContents'
import { AppMenuLinkButton } from './AppMenuLinkButton'
import { appMenuStore } from './AppMenuStore'
import { useUserStore } from './userStore'

export const AppMenuButton = memo(() => {
  const userStore = useUserStore()
  const media = useMedia()
  const appMenu = useStoreInstance(appMenuStore)
  const showUserMenu = appMenu.isVisible
  // const pageName = useRouterCurPage().name

  return (
    <XStack alignItems="center">
      <Popover
        placement="bottom"
        isOpen={showUserMenu}
        onChangeOpen={appMenu.setIsVisible}
        trigger={(props) => {
          return (
            <AppMenuLinkButton
              Icon={Menu}
              {...props}
              onPress={() => appMenu.setIsVisible(!showUserMenu)}
            >
              <Text display={userStore.isLoggedIn ? 'none' : 'flex'} $sm={{ display: 'none' }}>
                Signup
              </Text>
            </AppMenuLinkButton>
          )
        }}
      >
        <Popover.Content>
          {/* CONTENTS HERE */}
          <AppMenuContents hideUserMenu={appMenu.hide} />
        </Popover.Content>
      </Popover>
    </XStack>
  )
})
