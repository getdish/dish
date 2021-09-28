import { slugify } from '@dish/graph'
import { Plus } from '@dish/react-feather'
import React, { useState } from 'react'
import { GestureResponderEvent } from 'react-native'
import { Box, Popover, Theme, VStack } from 'snackui'

import { searchBarHeight } from '../constants/constants'
import { getWindowHeight } from '../helpers/getWindow'
import { AppMenuLinkButton } from './AppMenuLinkButton'
import { MenuLinkButton } from './MenuLinkButton'
import { useUserStore } from './userStore'

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
            <Theme name="dark">
              <AppActionButtonContents hide={() => setVisible(false)} />
            </Theme>
          </Popover.Content>
        ) : null
      }
    </Popover>
  )
}

const AppActionButtonContents = ({ hide }: { hide?: (e: GestureResponderEvent) => any }) => {
  const { user } = useUserStore()
  return (
    <Box
      maxHeight={Math.max(350, getWindowHeight() - searchBarHeight - 30)}
      padding={0}
      alignItems="stretch"
      pointerEvents="auto"
      minWidth={240}
      width={240}
    >
      {/* safari y={} fix overflow */}
      <VStack overflow="hidden" borderRadius={12} y={0.01}>
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
      </VStack>
    </Box>
  )
}
