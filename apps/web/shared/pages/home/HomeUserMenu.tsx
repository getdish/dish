import { slugify } from '@dish/graph'
import { Box, Divider, HStack, Popover, Text, Toast, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { User } from 'react-feather'

import { useOvermind } from '../../state/useOvermind'
import { AuthLoginRegisterView } from '../../views/auth/AuthLoginRegisterView'
import { LinkButton } from '../../views/ui/LinkButton'
import { flatButtonStyle } from './baseButtonStyle'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export const HomeUserMenu = memo(() => {
  const om = useOvermind()
  const isSmall = useMediaQueryIsSmall()
  // const [firstTime, setFirstTime] = useStorageState(
  //   localStorage,
  //   'firstTime',
  //   true
  // )

  const close = () => {
    // setFirstTime(false)
    om.actions.home.setShowUserMenu(false)
  }

  return (
    <Popover
      position="bottom"
      isOpen={om.state.home.showUserMenu}
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
        padding={12}
        onPress={() =>
          om.actions.home.setShowUserMenu(!om.state.home.showUserMenu)
        }
      >
        <HStack spacing alignItems="center" justifyContent="center">
          <User color="#fff" size={22} opacity={0.65} />
          {!isSmall && !om.state.user.isLoggedIn && (
            <Text opacity={0.5} color="#fff">
              Signup
            </Text>
          )}
        </HStack>
      </LinkButton>
    </Popover>
  )
})
