import { searchBarHeight } from '../constants/constants'
import { getWindowHeight } from '../helpers/getWindow'
import { AppMenuLinkButton } from './AppMenuLinkButton'
import { MenuLinkButton } from './MenuLinkButton'
import { useUserStore } from './userStore'
import { slugify } from '@dish/graph'
import { Card, Popover, YStack } from '@dish/ui'
import { Plus } from '@tamagui/feather-icons'
import React, { useState } from 'react'
import { GestureResponderEvent } from 'react-native'

export const AppActionButton = () => {
  const [visible, setVisible] = useState(false)
  return (
    <Popover
      placement="bottom"
      isOpen={visible}
      onChangeOpen={setVisible}
      trigger={(props) => (
        <AppMenuLinkButton
          {...props}
          onPress={() => setVisible((x) => !x)}
          Icon={Plus}
          tooltip="Create"
        />
      )}
    >
      {({ open }) =>
        open ? (
          <Popover.Content>
            <AppActionButtonContents hide={() => setVisible(false)} />
          </Popover.Content>
        ) : null
      }
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
