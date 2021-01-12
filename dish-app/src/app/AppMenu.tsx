import { slugify } from '@dish/graph'
import { ChevronUp, HelpCircle, Menu } from '@dish/react-feather'
import { useStoreInstance } from '@dish/use-store'
import React, { Suspense, memo, useEffect } from 'react'
import { HStack, Popover, Spacer, Text, Tooltip, useMedia } from 'snackui'

import { useRouterCurPage } from '../router'
import { AppMenuContents } from './AppMenuContents'
import { appMenuStore } from './AppMenuStore'
import { UserAvatar } from './home/user/UserAvatar'
import { homeStore } from './homeStore'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { useUserStore } from './userStore'
import { LinkButton } from './views/LinkButton'
import { LinkButtonProps } from './views/LinkProps'

export const AppMenu = memo(() => {
  const userStore = useUserStore()
  const media = useMedia()
  const appMenu = useStoreInstance(appMenuStore)
  const showUserMenu = appMenu.showMenu
  const pageName = useRouterCurPage().name

  useEffect(() => {
    // open menu on nav to login/register
    if (
      pageName == 'login' ||
      pageName == 'register' ||
      pageName == 'passwordReset'
    ) {
      appMenu.hide()
    }
  }, [pageName])

  return (
    <HStack alignItems="center">
      <Popover
        position="bottom"
        isOpen={showUserMenu}
        noArrow
        onChangeOpen={appMenu.setShowMenu}
        contents={<AppMenuContents hideUserMenu={appMenu.hide} />}
        mountImmediately
      >
        <MenuLinkButton
          Icon={Menu}
          onPress={() => appMenu.setShowMenu(!showUserMenu)}
          text={!media.sm && !userStore.isLoggedIn ? 'Signup' : ''}
        />
      </Popover>

      {media.md && (
        <>
          {userStore.isLoggedIn && (
            <>
              <Spacer size={6} />
              <Suspense fallback={<Spacer size={32} />}>
                <UserMenuButton />
              </Suspense>
              <Spacer size={10} />
            </>
          )}

          {!userStore.isLoggedIn && (
            <Tooltip contents="About">
              <MenuLinkButton
                name="about"
                Icon={HelpCircle}
                ActiveIcon={ChevronUp}
                onPress={(e) => {
                  if (pageName === 'about') {
                    e.preventDefault()
                    homeStore.up()
                  } else {
                    // @ts-expect-error
                    e.navigate()
                  }
                }}
              />
            </Tooltip>
          )}
        </>
      )}
    </HStack>
  )
})

const UserMenuButton = () => {
  const user = useUserStore().user

  if (!user) {
    return null
  }

  return (
    <Tooltip contents="Profile">
      <LinkButton
        backgroundColor="transparent"
        name="user"
        noTextWrap
        params={{
          username: slugify(user.username ?? ''),
        }}
      >
        <UserAvatar
          size={32}
          avatar={user.avatar ?? ''}
          charIndex={user.charIndex ?? 0}
        />
      </LinkButton>
    </Tooltip>
  )
}

const MenuLinkButton = memo(
  ({
    Icon,
    ActiveIcon,
    text,
    tooltip,
    ...props
  }: LinkButtonProps & {
    Icon: any
    ActiveIcon?: any
    text?: any
    tooltip?: string
  }) => {
    const { color } = useSearchBarTheme()

    const linkButtonElement = (
      <LinkButton
        enableActiveStyle
        className="ease-in-out-fast"
        padding={12}
        backgroundColor="transparent"
        opacity={0.6}
        alignSelf="stretch"
        width="100%"
        pressStyle={{
          opacity: 1,
          transform: [{ scale: 1.1 }],
        }}
        hoverStyle={{
          opacity: 1,
          transform: [{ scale: 1.05 }],
        }}
        {...props}
      >
        {(isActive) => {
          const IconElement = isActive ? ActiveIcon ?? Icon : Icon
          return (
            <HStack spacing alignItems="center" justifyContent="center">
              <IconElement color={color} size={22} />
              {!!text && (
                <Text color={color} fontSize={13} fontWeight="500">
                  {text}
                </Text>
              )}
            </HStack>
          )
        }}
      </LinkButton>
    )

    if (!!tooltip) {
      return <Tooltip contents={tooltip}>{linkButtonElement}</Tooltip>
    }

    return linkButtonElement
  }
)
