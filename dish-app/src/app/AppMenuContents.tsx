import { slugify } from '@dish/graph'
import React, { memo } from 'react'
import { Box, BoxProps, Divider, Spacer, Toast, VStack } from 'snackui'
import { isWeb } from 'snackui/src/constants'

import { appMenuStore } from './AppMenuStore'
import { useUserStore } from './userStore'
import { LinkButton } from './views/LinkButton'
import { LinkButtonProps } from './views/LinkProps'
import { LoginRegisterForm } from './views/LoginRegisterForm'

export const AppMenuContents = memo(
  ({ hideUserMenu, ...props }: { hideUserMenu: Function } & BoxProps) => {
    const { isLoggedIn, user, logout } = useUserStore()

    return (
      <Box alignItems="stretch" minWidth={240} {...props}>
        <VStack spacing="sm" padding={10}>
          {isLoggedIn && (
            <MenuLinkButton
              name="user"
              params={{
                username: slugify(user?.username ?? ''),
              }}
            >
              Profile
            </MenuLinkButton>
          )}

          {isLoggedIn && (
            <MenuLinkButton
              name="list"
              params={{
                userSlug: slugify(user?.username ?? ''),
                slug: 'create',
              }}
            >
              Create Playlist
            </MenuLinkButton>
          )}

          {isLoggedIn && user?.username === 'admin' && (
            <MenuLinkButton name="adminTags">Admin</MenuLinkButton>
          )}

          {isLoggedIn && (
            <>
              <Spacer size="lg" />
              <Divider />
              <Spacer size="lg" />
            </>
          )}

          {isWeb && <MenuLinkButton name="blog">Blog</MenuLinkButton>}
          <MenuLinkButton name="about">About</MenuLinkButton>

          {!isLoggedIn && (
            <>
              <Spacer size="lg" />
              <Divider />
              <Spacer size="lg" />
              <LoginRegisterForm onDidLogin={hideUserMenu} />
            </>
          )}

          {isLoggedIn && (
            <>
              <Spacer size="lg" />
              <Divider />
              <Spacer size="lg" />
              <MenuLinkButton
                onPress={() => {
                  Toast.show(`Logging out...`)
                  setTimeout(logout, 1000)
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
      hoverStyle={{
        transform: [{ scale: 1.03 }],
      }}
      onPressOut={appMenuStore.hide}
      {...props}
    />
  )
}
