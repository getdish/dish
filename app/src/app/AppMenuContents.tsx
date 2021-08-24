import { slugify } from '@dish/graph'
import { Sun } from '@dish/react-feather'
import { capitalize } from 'lodash'
import React, { memo, useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import {
  AbsoluteVStack,
  Box,
  BoxProps,
  Divider,
  Paragraph,
  Spacer,
  Toast,
  VStack,
  useDebounceEffect,
} from 'snackui'

import { isWeb, searchBarHeight } from '../constants/constants'
import { isHermes } from '../constants/platforms'
import { getWindowHeight } from '../helpers/getWindow'
import { appStore } from './AppStore'
import { AuthForm } from './AuthForm'
import { MenuLinkButton } from './MenuLinkButton'
import { UserMenuButton } from './UserMenuButton'
import { useUserStore } from './userStore'
import { LogoColor } from './views/Logo'

export const AppMenuContents = memo(
  ({ hideUserMenu, ...props }: { hideUserMenu: Function } & BoxProps) => {
    const userStore = useUserStore()
    const { isLoggedIn, user, logout } = userStore
    const [showContents, setShowContents] = useState(false)

    // dirty web autofocus fix
    useDebounceEffect(
      () => {
        setShowContents(true)
      },
      30,
      []
    )

    return (
      <Box
        maxHeight={Math.max(350, getWindowHeight() - searchBarHeight - 30)}
        minHeight={250}
        padding={0}
        alignItems="stretch"
        pointerEvents="auto"
        minWidth={240}
        {...props}
      >
        {/* safari y={} fix overflow */}
        <VStack overflow="hidden" borderRadius={12} y={0.01}>
          {showContents && (
            <ScrollView>
              {!isWeb && (
                <VStack alignItems="center" justifyContent="center">
                  <LogoColor scale={1.5} />
                  <Spacer />
                </VStack>
              )}

              {!isLoggedIn && (
                <>
                  <VStack padding={20}>
                    <AuthForm autoFocus onDidLogin={hideUserMenu} />
                  </VStack>
                  <Divider />
                </>
              )}

              {isLoggedIn && (
                <MenuLinkButton
                  name="user"
                  icon={<UserMenuButton />}
                  params={{
                    username: slugify(user?.username ?? ''),
                  }}
                >
                  Profile
                </MenuLinkButton>
              )}

              <MenuLinkButton
                promptLogin
                name="list"
                params={{
                  userSlug: slugify(user?.username ?? 'me'),
                  slug: 'create',
                }}
              >
                Create Playlist
              </MenuLinkButton>

              {isLoggedIn && user?.username === 'admin' && (
                <MenuLinkButton name="adminTags">Admin</MenuLinkButton>
              )}

              {isLoggedIn && (
                <>
                  <Divider />
                </>
              )}

              <MenuLinkButton
                iconAfter={<Sun color="rgba(150,150,150,0.5)" size={16} />}
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
                {capitalize(userStore.theme ?? 'auto')}
              </MenuLinkButton>

              {/* {isWeb && <MenuLinkButton name="blog">Blog</MenuLinkButton>} */}
              <MenuLinkButton name="about">About</MenuLinkButton>

              {isLoggedIn && (
                <>
                  <Divider />
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
                    Toggle {key}
                  </MenuLinkButton>
                )
              })}

              <Paragraph position="absolute" bottom={0} left={0} opacity={0.05} size="xxs">
                {isHermes ? 'hermes' : 'jsc'}
              </Paragraph>
            </ScrollView>
          )}
        </VStack>
      </Box>
    )
  }
)
