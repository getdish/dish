import { AppMenuContents } from './AppMenuContents'
import { AppMenuLinkButton } from './AppMenuLinkButton'
import { appMenuStore } from './AppMenuStore'
import { useUserStore } from './userStore'
import { DishLogoButton } from './views/DishLogoButton'
import { LogoCircle } from './views/Logo'
import { Popover, SizableText, XStack, YStack, useMedia } from '@dish/ui'
import { useStoreInstance } from '@dish/use-store'
import { Menu } from '@tamagui/feather-icons'
import React, { memo } from 'react'

export const AppMenuButton = memo(() => {
  const userStore = useUserStore()
  const appMenu = useStoreInstance(appMenuStore)
  const media = useMedia()
  const showUserMenu = appMenu.isVisible

  return (
    <XStack alignItems="center">
      <Popover placement="bottom" open={showUserMenu} onOpenChange={appMenu.setIsVisible}>
        <Popover.Trigger>
          <AppMenuLinkButton
            size="$5"
            br="$8"
            Icon={Menu}
            onPress={() => appMenu.setIsVisible(!showUserMenu)}
          >
            <LogoCircle />
          </AppMenuLinkButton>
        </Popover.Trigger>
        <Popover.Content
          backgroundColor="$backgroundTransparent"
          className="blur"
          bordered
          p={0}
          elevation="$3"
          br="$4"
        >
          <YStack zi={0} br="$4" fullscreen bc="$background" o={0.8} />
          <Popover.Arrow size="$2" />
          <AppMenuContents hideUserMenu={appMenu.hide} />
        </Popover.Content>
      </Popover>
    </XStack>
  )
})
