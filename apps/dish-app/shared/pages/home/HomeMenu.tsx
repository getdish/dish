import { slugify } from '@dish/graph'
import { ChevronUp, Coffee, HelpCircle, Menu } from '@dish/react-feather'
import {
  Box,
  Divider,
  HStack,
  Popover,
  Spacer,
  Text,
  Toast,
  Tooltip,
  VStack,
} from '@dish/ui'
import React, { memo, useCallback, useEffect } from 'react'

import { omStatic, useOvermind } from '../../state/om'
import { LinkButton } from '../../views/ui/LinkButton'
import { LinkButtonProps } from '../../views/ui/LinkProps'
import { flatButtonStyle } from './baseButtonStyle'
import { initAppleSigninButton } from './initAppleSigninButton'
import { LoginRegisterForm } from './LoginRegisterForm'
import { useIsAboveMedium, useIsNarrow } from './useIs'
import { useSearchBarTheme } from './useSearchBarTheme'

const MenuLinkButton = (props: LinkButtonProps) => {
  return (
    <LinkButton
      {...flatButtonStyle}
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

export const HomeMenu = memo(() => {
  const om = useOvermind()
  const isSmall = useIsNarrow()
  const isAboveMedium = useIsAboveMedium()
  const showUserMenu = om.state.home.showUserMenu
  const setShowUserMenu = om.actions.home.setShowUserMenu
  const pageName = om.state.router.curPage.name
  const hideUserMenu = useCallback((x) => setShowUserMenu(false), [])

  useEffect(() => {
    // open menu on nav to login/register
    if (pageName == 'login' || pageName == 'register') {
      setShowUserMenu(true)
    }
  }, [pageName])

  return (
    <HStack>
      <Popover
        position="bottom"
        isOpen={showUserMenu}
        noArrow
        onChangeOpen={(val) => val === false && setShowUserMenu(false)}
        contents={<UserMenuContents hideUserMenu={hideUserMenu} />}
        mountImmediately
      >
        <MenuButton
          Icon={Menu}
          onPress={() => setShowUserMenu(!showUserMenu)}
          text={!isSmall && !om.state.user.isLoggedIn ? 'Signup' : ''}
        />
      </Popover>

      {isAboveMedium && (
        <>
          <Tooltip contents="About">
            <MenuButton
              name="about"
              Icon={HelpCircle}
              ActiveIcon={ChevronUp}
              onPress={(e) => {
                if (omStatic.state.router.curPageName === 'about') {
                  e.preventDefault()
                  omStatic.actions.home.up()
                } else {
                  e.navigate()
                }
              }}
            />
          </Tooltip>
        </>
      )}
    </HStack>
  )
})

const UserMenuContents = memo(
  ({ hideUserMenu }: { hideUserMenu: Function }) => {
    const om = useOvermind()

    useEffect(() => {
      initAppleSigninButton()
    }, [])

    return (
      <Box
        alignItems="stretch"
        padding={20}
        width="35vw"
        minWidth={240}
        maxWidth={300}
      >
        <VStack spacing="sm">
          {om.state.user.isLoggedIn &&
            om.state.user.user.username === 'admin' && (
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

          <MenuLinkButton name="about">About</MenuLinkButton>
        </VStack>

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
      </Box>
    )
  }
)

const MenuButton = memo(
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
        className="ease-in-out-fast"
        padding={12}
        opacity={0.6}
        alignSelf="stretch"
        width="100%"
        activeStyle={{
          opacity: 1,
          transform: [{ scale: 1.1 }],
        }}
        hoverStyle={{
          opacity: 1,
        }}
        {...props}
      >
        {(isActive) => {
          const IconElement = isActive ? ActiveIcon : Icon
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
