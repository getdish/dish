import { slugify } from '@dish/graph'
import { Sun } from '@dish/react-feather'
import React, { memo } from 'react'
import { ScrollView } from 'react-native'
import { AbsoluteVStack, Box, BoxProps, Divider, Paragraph, Spacer, Toast, VStack } from 'snackui'

import { isWeb, searchBarHeight } from '../constants/constants'
import { isHermes } from '../constants/platforms'
import { getWindowHeight } from '../helpers/getWindow'
import { UserMenuButton } from './AppMenu'
import { appMenuStore } from './AppMenuStore'
import { appStore } from './AppStore'
import { AuthForm } from './AuthForm'
import { useUserStore } from './userStore'
import { LinkButton } from './views/LinkButton'
import { LinkButtonProps } from './views/LinkProps'
import { LogoColor } from './views/Logo'

export const AppMenuContents = memo(
  ({ hideUserMenu, ...props }: { hideUserMenu: Function } & BoxProps) => {
    const userStore = useUserStore()
    const { isLoggedIn, user, logout } = userStore

    return (
      <Box
        maxHeight={Math.max(350, getWindowHeight() - searchBarHeight - 30)}
        alignItems="stretch"
        pointerEvents="auto"
        minWidth={240}
        {...props}
      >
        <ScrollView>
          <VStack spacing="sm" padding={10}>
            {!isWeb && (
              <VStack alignItems="center" justifyContent="center">
                <LogoColor scale={1.5} />
                <Spacer />
              </VStack>
            )}

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
                e.stopPropagation()
                e.preventDefault()
                setTimeout(() => {
                  const next = (() => {
                    switch (userStore.theme) {
                      // 🏓 auto = null
                      case 'dark':
                        return null
                      case 'light':
                        return 'dark'
                      case null:
                        return 'light'
                    }
                  })()
                  userStore.setTheme(next)
                })
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

            {Object.keys(appStore.show).map((key) => {
              return (
                <MenuLinkButton
                  key={key}
                  onPress={() => {
                    appStore.show = {
                      ...appStore.show,
                      [key]: !appStore.show[key],
                    }
                  }}
                >
                  toggle {key}
                </MenuLinkButton>
              )
            })}

            <Paragraph opacity={0.05} size="xxs">
              {isHermes ? 'hermes' : 'jsc'}
            </Paragraph>
          </VStack>
        </ScrollView>
      </Box>
    )
  }
)

const MenuLinkButton = (props: LinkButtonProps) => {
  return (
    <LinkButton
      width="100%"
      paddingVertical={12}
      paddingHorizontal={16}
      textProps={{
        fontSize: 16,
      }}
      hoverStyle={{
        transform: [{ scale: 1.03 }],
      }}
      // onPressOut={appMenuStore.hide}
      {...props}
    />
  )
}
