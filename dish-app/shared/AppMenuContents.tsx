import { slugify } from '@dish/graph'
import React, { memo } from 'react'
import { Box, BoxProps, Divider, Spacer, Toast, VStack } from 'snackui'
import { isWeb } from 'snackui/src/constants'

import { omStatic } from './state/omStatic'
import { useOvermind } from './state/useOvermind'
import { flatButtonStyle } from './views/baseButtonStyle'
import { LoginRegisterForm } from './views/LoginRegisterForm'
import { LinkButton } from './views/ui/LinkButton'
import { LinkButtonProps } from './views/ui/LinkProps'

export const AppMenuContents = memo(
  ({ hideUserMenu, ...props }: { hideUserMenu: Function } & BoxProps) => {
    const om = useOvermind()

    return (
      <Box alignItems="stretch" minWidth={240} {...props}>
        <VStack spacing="sm" padding={10}>
          {om.state.user.isLoggedIn &&
            om.state.user.user?.username === 'admin' && (
              <MenuLinkButton name="adminTags">Admin</MenuLinkButton>
            )}

          {om.state.user.isLoggedIn && (
            <MenuLinkButton
              name="user"
              params={{
                username: slugify(om.state.user.user?.username ?? ''),
              }}
            >
              Profile
            </MenuLinkButton>
          )}

          {isWeb && <MenuLinkButton name="blog">Blog</MenuLinkButton>}
          <MenuLinkButton name="about">About</MenuLinkButton>
          {!om.state.user.isLoggedIn && (
            <>
              <Spacer size="lg" />
              <Divider />
              <Spacer size="lg" />
              <LoginRegisterForm onDidLogin={hideUserMenu} />
            </>
          )}

          {om.state.user.isLoggedIn && (
            <>
              <Spacer size="lg" />
              <Divider />
              <Spacer size="lg" />
              <MenuLinkButton
                onPress={() => {
                  Toast.show(`Logging out...`)
                  setTimeout(() => {
                    om.actions.user.logout()
                  }, 1000)
                }}
              >
                Logout
              </MenuLinkButton>
            </>
          )}
        </VStack>
      </Box>
    )
  }
)

const MenuLinkButton = (props: LinkButtonProps) => {
  return (
    <LinkButton
      width="100%"
      {...flatButtonStyle}
      hoverStyle={{
        transform: [{ scale: 1.03 }],
      }}
      paddingVertical={8}
      onPressOut={() => {
        if (omStatic.state.home.showUserMenu) {
          omStatic.actions.home.setShowUserMenu(false)
        }
      }}
      fontSize={18}
      {...props}
    />
  )
}
