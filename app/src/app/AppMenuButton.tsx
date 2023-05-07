import { AppMenuContents } from './AppMenuContents'
import { AppMenuLinkButton } from './AppMenuLinkButton'
import { appMenuStore } from './AppMenuStore'
import { Adapt, Popover, YStack } from '@dish/ui'
import { Menu } from '@tamagui/lucide-icons'
import { useGlobalStore } from '@tamagui/use-store'
import React, { memo } from 'react'

export const AppMenuButton = memo(() => {
  const appMenu = useGlobalStore(appMenuStore)
  const showUserMenu = appMenu.isVisible

  return (
    <Popover placement="bottom" open={showUserMenu} onOpenChange={appMenu.setIsVisible}>
      <Popover.Trigger>
        <AppMenuLinkButton
          size="$6"
          px="$4"
          Icon={Menu}
          onPress={() => appMenu.setIsVisible(!showUserMenu)}
        ></AppMenuLinkButton>
      </Popover.Trigger>

      <Adapt when="sm" platform="touch">
        <Popover.Sheet dismissOnSnapToBottom modal>
          <Popover.Sheet.Overlay />
          <Popover.Sheet.Frame>
            <Popover.Sheet.ScrollView contentContainerStyle={{ height: 1200 }}>
              <Adapt.Contents />
            </Popover.Sheet.ScrollView>
          </Popover.Sheet.Frame>
        </Popover.Sheet>
      </Adapt>

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
  )
})
