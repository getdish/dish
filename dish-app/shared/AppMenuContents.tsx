import { slugify } from '@dish/graph'
import React, { memo } from 'react'
import { Box, BoxProps, Divider, Spacer, Toast, VStack } from 'snackui'
import { isWeb } from 'snackui/src/constants'

import { appMenuStore } from './AppMenuStore'
import { useUserStore } from './state/user'
import { flatButtonStyle } from './views/baseButtonStyle'
import { LoginRegisterForm } from './views/LoginRegisterForm'
import { LinkButton } from './views/ui/LinkButton'
import { LinkButtonProps } from './views/ui/LinkProps'

export const AppMenuContents = memo(
  ({ hideUserMenu, ...props }: { hideUserMenu: Function } & BoxProps) => {
    const userStore = useUserStore()

    return (
      <Box alignItems="stretch" minWidth={240} {...props}>
        <VStack spacing="sm" padding={10}>
          {userStore.isLoggedIn && userStore.user?.username === 'admin' && (
            <MenuLinkButton name="adminTags">Admin</MenuLinkButton>
          )}

          {userStore.isLoggedIn && (
            <MenuLinkButton
              name="user"
              params={{
                username: slugify(userStore.user?.username ?? ''),
              }}
            >
              Profile
            </MenuLinkButton>
          )}

          {isWeb && <MenuLinkButton name="blog">Blog</MenuLinkButton>}
          <MenuLinkButton name="about">About</MenuLinkButton>
          {!userStore.isLoggedIn && (
            <>
              <Spacer size="lg" />
              <Divider />
              <Spacer size="lg" />
              <LoginRegisterForm onDidLogin={hideUserMenu} />
            </>
          )}

          {userStore.isLoggedIn && (
            <>
              <Spacer size="lg" />
              <Divider />
              <Spacer size="lg" />
              <MenuLinkButton
                onPress={() => {
                  Toast.show(`Logging out...`)
                  setTimeout(() => {
                    userStore.logout()
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
      onPressOut={appMenuStore.hide}
      fontSize={18}
      {...props}
    />
  )
}
