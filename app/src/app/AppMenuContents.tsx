import { isWeb, searchBarHeight } from '../constants/constants'
import { getWindowHeight } from '../helpers/getWindow'
import { appStore } from './AppStore'
import { AuthForm } from './AuthForm'
import { MenuLinkButton } from './MenuLinkButton'
import { UserMenuButton } from './UserMenuButton'
import { useUserStore } from './userStore'
import { LogoColor } from './views/Logo'
import { slugify } from '@dish/graph'
import {
  Card,
  Separator,
  Spacer,
  Toast,
  YStack,
  YStackProps,
  useDebounceEffect,
} from '@dish/ui'
import { Coffee, HelpCircle, LogOut, Plus, Sun, Truck, User } from '@tamagui/lucide-icons'
import { capitalize } from 'lodash'
import React, { forwardRef, memo, useState } from 'react'
import { ScrollView, useColorScheme } from 'react-native'

// import useTilg from 'tilg'

export const AppMenuContents = memo(
  forwardRef(({ hideUserMenu, ...props }: { hideUserMenu: Function } & YStackProps, ref) => {
    const userStore = useUserStore()
    const { isLoggedIn, user, logout } = userStore
    const [showContents, setShowContents] = useState(false)
    const colorScheme = useColorScheme()

    // dirty web autofocus fix
    useDebounceEffect(
      () => {
        setShowContents(true)
      },
      30,
      []
    )

    return (
      <YStack
        maxHeight={Math.max(350, getWindowHeight() - searchBarHeight - 30)}
        minHeight={250}
        alignItems="stretch"
        pointerEvents="auto"
        minWidth={300}
        // width={300}
        {...(!isWeb && {
          width: '100%',
          height: '100%',
        })}
        ref={ref as any}
        {...props}
      >
        {/* safari y={} fix overflow */}
        <YStack flex={1} overflow="hidden" borderRadius={12} y={0.01}>
          {showContents && (
            <>
              {!isWeb && (
                <YStack alignItems="center" justifyContent="center">
                  <LogoColor scale={1.5} />
                  <Spacer />
                </YStack>
              )}

              {!isLoggedIn && (
                <>
                  <YStack py="$4">
                    <AuthForm autoFocus onDidLogin={hideUserMenu} />
                  </YStack>
                  <Separator />
                </>
              )}

              {isLoggedIn && (
                <MenuLinkButton
                  name="user"
                  icon={<UserMenuButton />}
                  py="$6"
                  params={{
                    username: slugify(user?.username ?? ''),
                  }}
                >
                  {user?.name ?? user?.username ?? ''}
                </MenuLinkButton>
              )}

              <MenuLinkButton
                promptLogin
                name="list"
                icon={Plus}
                params={{
                  userSlug: slugify(user?.username ?? 'me'),
                  slug: 'create',
                }}
              >
                Create list
              </MenuLinkButton>

              {isLoggedIn && user?.username === 'admin' && (
                <MenuLinkButton name="adminTags" icon={<Coffee color="#999" size={14} />}>
                  Admin
                </MenuLinkButton>
              )}

              {isLoggedIn && (
                <>
                  <Separator />
                </>
              )}

              <MenuLinkButton
                icon={<Sun color="#999" size={14} />}
                debug
                onPress={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  setTimeout(() => {
                    const next = (() => {
                      switch (userStore.theme) {
                        // 🏓 auto = null
                        case 'dark':
                          return 'light'
                        case 'light':
                          return 'auto'
                        default:
                        case 'auto':
                          return colorScheme === 'dark' ? 'light' : 'dark'
                      }
                    })()
                    userStore.setTheme(next)
                  })
                }}
              >
                Theme: {capitalize(userStore.theme ?? 'auto')}
              </MenuLinkButton>

              {isLoggedIn && (
                <MenuLinkButton name="account" icon={<User size={14} color="#999" />}>
                  Account
                </MenuLinkButton>
              )}

              {isLoggedIn && (
                <>
                  <Separator />
                  <MenuLinkButton
                    icon={<LogOut size={14} color="#999" />}
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

              <>
                <Separator />
                {/* {isWeb && <MenuLinkButton name="blog">Blog</MenuLinkButton>} */}
                <MenuLinkButton name="about" icon={<HelpCircle color="#999" size={14} />}>
                  About
                </MenuLinkButton>
              </>

              <MenuLinkButton name="roadmap" icon={<Truck color="#999" size={14} />}>
                Roadmap
              </MenuLinkButton>
            </>
          )}
        </YStack>
      </YStack>
    )
  })
)
