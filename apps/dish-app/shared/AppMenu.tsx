import { ChevronUp, HelpCircle, Menu } from '@dish/react-feather'
import { HStack, Popover, Text, Tooltip } from '@dish/ui'
import React, { memo, useCallback, useEffect } from 'react'

import { useIsAboveMedium, useIsNarrow } from './hooks/useIs'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { useOvermind } from './state/om'
import { omStatic } from './state/omStatic'
import { UserMenuContents } from './UserMenuContents'
import { LinkButton } from './views/ui/LinkButton'
import { LinkButtonProps } from './views/ui/LinkProps'

export const AppMenu = memo(() => {
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
        noText
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
