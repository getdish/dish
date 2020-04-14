import { slugify } from '@dish/models'
import React, { memo } from 'react'
import { Text } from 'react-native'
import { useStorageState } from 'react-storage-hooks'

import { useOvermind } from '../../state/om'
import { AuthLoginRegisterView } from '../auth/AuthLoginRegisterView'
import { Box } from '../ui/Box'
import { Divider } from '../ui/Divider'
import { Icon } from '../ui/Icon'
import { LinkButton } from '../ui/Link'
import { Popover } from '../ui/Popover'
import { HStack, VStack } from '../ui/Stacks'
import { flatButtonStyle } from './baseButtonStyle'

export const HomeUserMenu = memo(() => {
  const om = useOvermind()
  const [firstTime, setFirstTime] = useStorageState(
    localStorage,
    'firstTime',
    true
  )

  const close = () => {
    setFirstTime(false)
    om.actions.home.setShowUserMenu(false)
  }

  return (
    <Popover
      position="bottom"
      isOpen={firstTime || om.state.home.showUserMenu}
      onClickOutside={() => {
        close()
      }}
      contents={
        <Box padding={20} width="30vw" minWidth={250}>
          {!om.state.user.isLoggedIn && (
            <AuthLoginRegisterView
              setMenuOpen={(x) => om.actions.home.setShowUserMenu(x)}
            />
          )}

          {om.state.user.isLoggedIn && (
            <VStack spacing>
              <LinkButton
                {...flatButtonStyle}
                name="user"
                params={{ username: slugify(om.state.user.user.username) }}
              >
                Profile
              </LinkButton>
              <Divider />
              <LinkButton
                onPress={() => {
                  om.actions.user.logout()
                  close()
                }}
              >
                Logout
              </LinkButton>
            </VStack>
          )}
        </Box>
      }
    >
      <LinkButton
        flexDirection="row"
        pointerEvents="auto"
        padding={15}
        onPress={() =>
          om.actions.home.setShowUserMenu(!om.state.home.showUserMenu)
        }
      >
        <HStack spacing alignItems="center" justifyContent="center">
          <Icon name="user" size={22} opacity={0.5} />
          {/* {om.state.user.isLoggedIn ? (
            <Text
              numberOfLines={1}
              style={{ fontSize: 12, opacity: 0.5, maxWidth: 50 }}
            >
              {om.state.user.user.username}
            </Text>
          ) : null} */}
        </HStack>
      </LinkButton>
    </Popover>
  )
})
