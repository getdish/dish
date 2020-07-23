import { slugify } from '@dish/graph'
import { Box, Divider, HStack, Popover, Text, Toast, VStack } from '@dish/ui'
import React, { memo, useState } from 'react'
import { Menu, Settings, User } from 'react-feather'

import { useOvermind } from '../../state/useOvermind'
import { AuthLoginRegisterView } from '../../views/auth/AuthLoginRegisterView'
import { LinkButton } from '../../views/ui/LinkButton'
import { LinkButtonProps } from '../../views/ui/LinkProps'
import { flatButtonStyle } from './baseButtonStyle'
import {
  useMediaQueryIsAboveMedium,
  useMediaQueryIsMedium,
  useMediaQueryIsSmall,
} from './useMediaQueryIs'

export const HomeMenu = memo(() => {
  const om = useOvermind()
  const isSmall = useMediaQueryIsSmall()
  const isAboveMedium = useMediaQueryIsAboveMedium()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <HStack>
      <Popover
        position="bottom"
        isOpen={showUserMenu}
        onChangeOpen={(val) => val === false && close()}
        style={{
          flex: 0,
        }}
        contents={
          <Box padding={20} width="35vw" minWidth={240} maxWidth={300}>
            {!om.state.user.isLoggedIn && (
              <AuthLoginRegisterView setMenuOpen={(x) => setShowUserMenu(x)} />
            )}

            {om.state.user.isLoggedIn && (
              <VStack
                spacing
                onPressOut={(e) => {
                  close()
                }}
              >
                {om.state.user.user?.username === 'admin' && (
                  <VStack spacing>
                    <LinkButton {...flatButtonStyle} name="admin">
                      <Settings
                        size={16}
                        opacity={0.25}
                        style={{ marginRight: 5 }}
                      />
                      Admin
                    </LinkButton>
                    <LinkButton {...flatButtonStyle} name="adminTags">
                      <Settings
                        size={16}
                        opacity={0.25}
                        style={{ marginRight: 5 }}
                      />
                      Admin Tags
                    </LinkButton>
                  </VStack>
                )}

                <LinkButton
                  {...flatButtonStyle}
                  name="user"
                  params={{
                    username: slugify(om.state.user.user?.username ?? ''),
                  }}
                >
                  Profile
                </LinkButton>
                <Divider />
                <LinkButton
                  onPress={() => {
                    Toast.show(`Logging out...`)
                    setTimeout(() => {
                      om.actions.user.logout()
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
        <MenuButton
          Icon={User}
          onPress={() => setShowUserMenu(!showUserMenu)}
          text={!isSmall && !om.state.user.isLoggedIn ? 'Signup' : ''}
        />
      </Popover>

      {isAboveMedium && <MenuButton name="about" Icon={Menu} />}
    </HStack>
  )
})

const MenuButton = ({
  Icon,
  text,
  ...props
}: LinkButtonProps & { Icon: any; text?: any }) => {
  return (
    <LinkButton padding={12} {...props}>
      <HStack spacing alignItems="center" justifyContent="center">
        <Icon color="#fff" size={22} opacity={0.65} />
        {!!text && (
          <Text fontSize={13} opacity={0.5} color="#fff">
            {text}
          </Text>
        )}
      </HStack>
    </LinkButton>
  )
}
