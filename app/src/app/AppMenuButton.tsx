import { Menu } from '@dish/react-feather'
import { useStoreInstance } from '@dish/use-store'
import React, { memo } from 'react'
import { HStack, Popover, Text, Theme, useMedia } from 'snackui'

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
    <HStack alignItems="center">
      <Popover
        position="bottom"
        isOpen={showUserMenu}
        noArrow
        onChangeOpen={appMenu.setIsVisible}
        contents={
          <Theme name="dark">
            {/* CONTENTS HERE */}
            <AppMenuContents hideUserMenu={appMenu.hide} />
          </Theme>
        }
        mountImmediately
      >
        <AppMenuLinkButton Icon={Menu} onPress={() => appMenu.setIsVisible(!showUserMenu)}>
          <Text display={!userStore.isLoggedIn || media.sm ? 'none' : 'flex'}>Signup</Text>
        </AppMenuLinkButton>
      </Popover>
    </HStack>
  )
})
