import { ChevronUp, HelpCircle, Menu } from '@dish/react-feather'
import { useStoreInstance } from '@dish/use-store'
import React, { memo } from 'react'
import { HStack, Popover, Theme, Tooltip, useMedia } from 'snackui'

import { useRouterCurPage } from '../router'
import { AppMenuContents } from './AppMenuContents'
import { AppMenuLinkButton } from './AppMenuLinkButton'
import { appMenuStore } from './AppMenuStore'
import { homeStore } from './homeStore'
import { useUserStore } from './userStore'

export const AppMenuButton = memo(() => {
  const userStore = useUserStore()
  const media = useMedia()
  const appMenu = useStoreInstance(appMenuStore)
  const showUserMenu = appMenu.isVisible
  const pageName = useRouterCurPage().name

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
        <AppMenuLinkButton
          Icon={Menu}
          onPress={() => appMenu.setIsVisible(!showUserMenu)}
          text={!media.sm && !userStore.isLoggedIn ? 'Signup' : ''}
        />
      </Popover>

      {media.md && (
        <>
          {!userStore.isLoggedIn && (
            <Tooltip contents="About">
              <AppMenuLinkButton
                name="about"
                Icon={HelpCircle}
                ActiveIcon={ChevronUp}
                onPress={(e) => {
                  if (pageName === 'about') {
                    e.preventDefault()
                    homeStore.up()
                  } else {
                    // @ts-ignore
                    e.navigate()
                  }
                }}
              />
            </Tooltip>
          )}
        </>
      )}
    </HStack>
  )
})
