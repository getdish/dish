import { slugify } from '@dish/graph'
import { Sun } from '@dish/react-feather'
import React, { memo } from 'react'
import { AbsoluteVStack, Box, BoxProps, Divider, Paragraph, Spacer, Toast, VStack } from 'snackui'

import { isHermes } from '../constants/platforms'
import { UserMenuButton } from './AppMenu'
import { appMenuStore } from './AppMenuStore'
import { AuthForm } from './AuthForm'
import { useUserStore } from './userStore'
import { LinkButton } from './views/LinkButton'
import { LinkButtonProps } from './views/LinkProps'

export const AppMenuContents = memo(
  ({ hideUserMenu, ...props }: { hideUserMenu: Function } & BoxProps) => {
    const userStore = useUserStore()
    const { isLoggedIn, user, logout } = userStore

    return (
      <Box
        backgroundColor="#000"
        alignItems="stretch"
        pointerEvents="auto"
        minWidth={240}
        {...props}
      >
        <VStack spacing="sm" padding={10}>
          {!isLoggedIn && (
            <>
              <AuthForm onDidLogin={hideUserMenu} />
              <Spacer size="md" />
              <Divider />
              <Spacer size="md" />
            </>
          )}

          {isLoggedIn && (
            <MenuLinkButton
              name="user"
              params={{
                username: slugify(user?.username ?? ''),
              }}
            >
              <>
                profile
                <AbsoluteVStack top={-7} right={0} bottom={0} alignItems="center">
                  <UserMenuButton />
                </AbsoluteVStack>
              </>
            </MenuLinkButton>
          )}

          <MenuLinkButton
            promptLogin
            name="list"
            params={{
              userSlug: slugify(user?.username ?? ''),
              slug: 'create',
            }}
          >
            create playlist
          </MenuLinkButton>

          {isLoggedIn && user?.username === 'admin' && (
            <MenuLinkButton name="adminTags">Admin</MenuLinkButton>
          )}

          {isLoggedIn && (
            <>
              <Spacer size="md" />
              <Divider />
              <Spacer size="md" />
            </>
          )}

          <MenuLinkButton
            icon={<Sun color="rgba(150,150,150,0.5)" size={16} />}
            onPress={(e) => {
              const next = (() => {
                switch (userStore.theme) {
                  case 'dark':
                    return null
                  case 'light':
                    return 'dark'
                  case null:
                    return 'light'
                }
              })()
              userStore.setTheme(next)
              e.stopPropagation()
            }}
          >
            {userStore.theme ?? 'auto'}
          </MenuLinkButton>

          {/* {isWeb && <MenuLinkButton name="blog">Blog</MenuLinkButton>} */}
          <MenuLinkButton name="about">about</MenuLinkButton>

          {isLoggedIn && (
            <>
              <Spacer size="md" />
              <Divider />
              <Spacer size="md" />
              <MenuLinkButton
                onPress={() => {
                  Toast.show(`Logging out...`)
                  setTimeout(logout, 1000)
                }}
              >
                logout
              </MenuLinkButton>
            </>
          )}

          <Paragraph opacity={0.5} size="xxs">
            {isHermes ? 'h' : 'x'}
          </Paragraph>
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
