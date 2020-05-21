import { slugify } from '@dish/graph'
import { Box, Divider, HStack, Popover, Toast, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { User } from 'react-feather'
import { useStorageState } from 'react-storage-hooks'

import { useOvermind } from '../../state/useOvermind'
import { AuthLoginRegisterView } from '../auth/AuthLoginRegisterView'
import { LinkButton } from '../ui/LinkButton'
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
      onChangeOpen={(val) => val === false && close()}
      style={{
        flex: 0,
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
                params={{
                  username: slugify(om.state.user.user?.username ?? ''),
                }}
                onPress={() => close()}
              >
                Profile
              </LinkButton>
              <Divider />
              <LinkButton
                onPress={() => {
                  Toast.show(`Logging out...`)
                  setTimeout(() => {
                    om.actions.user.logout()
                    close()
                  }, 1000)
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
          <User size={22} opacity={0.5} />
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
