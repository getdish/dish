import { searchBarHeight } from '../constants/constants'
import { getWindowHeight } from '../helpers/getWindow'
import { AppMenuLinkButton } from './AppMenuLinkButton'
import { MenuLinkButton } from './MenuLinkButton'
import { useUserStore } from './userStore'
import { slugify } from '@dish/graph'
import { Card, Popover, YStack } from '@dish/ui'
import { Plus } from '@tamagui/feather-icons'
import React from 'react'
import { GestureResponderEvent } from 'react-native'

export const AppActionButton = () => {
  return (
    <Popover placement="bottom">
      <Popover.Trigger>
        <AppMenuLinkButton Icon={Plus} tooltip="Create" />
      </Popover.Trigger>
      <Popover.Content>
        <AppActionButtonContents />
      </Popover.Content>
    </Popover>
  )
}

const AppActionButtonContents = ({ hide }: { hide?: (e: GestureResponderEvent) => any }) => {
  const { user } = useUserStore()
  return (
    <Card
      maxHeight={Math.max(350, getWindowHeight() - searchBarHeight - 30)}
      padding={0}
      alignItems="stretch"
      pointerEvents="auto"
      minWidth={240}
      width={240}
    >
      {/* safari y={} fix overflow */}
      <YStack overflow="hidden" borderRadius={12} y={0.01}>
        <MenuLinkButton
          promptLogin
          name="list"
          params={{
            userSlug: slugify(user?.username ?? 'me'),
            slug: 'create',
          }}
          onPressOut={hide}
        >
          Create list
        </MenuLinkButton>
      </YStack>
    </Card>
  )
}
