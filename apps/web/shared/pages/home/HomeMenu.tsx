import { slugify } from '@dish/graph'
import {
  Box,
  Circle,
  Divider,
  HStack,
  HoverablePopover,
  Popover,
  Text,
  Toast,
  Tooltip,
  VStack,
} from '@dish/ui'
import React, { memo, useState } from 'react'
import {
  Activity,
  Bold,
  ChevronDown,
  ChevronUp,
  Coffee,
  Hexagon,
  Menu,
  Settings,
  User,
} from 'react-feather'

import { omStatic, useOvermind } from '../../state/useOvermind'
import { AuthLoginRegisterView } from '../../views/auth/AuthLoginRegisterView'
import { LinkButton } from '../../views/ui/LinkButton'
import { LinkButtonProps } from '../../views/ui/LinkProps'
import { flatButtonStyle } from './baseButtonStyle'
import { useSearchBarTheme } from './HomeSearchBar'
import {
  useMediaQueryIsAboveMedium,
  useMediaQueryIsMedium,
  useMediaQueryIsSmall,
} from './useMediaQueryIs'

export const HomeMenu = memo(() => {
  const om = useOvermind()
  const isSmall = useMediaQueryIsSmall()
  const isAboveMedium = useMediaQueryIsAboveMedium()
  const showUserMenu = om.state.home.showUserMenu
  const setShowUserMenu = om.actions.home.setShowUserMenu

  return (
    <HStack>
      <Popover
        position="bottom"
        isOpen={showUserMenu}
        onChangeOpen={(val) => val === false && setShowUserMenu(false)}
        style={{
          flex: 0,
        }}
        contents={
          <Box padding={20} width="35vw" minWidth={240} maxWidth={300}>
            {!om.state.user.isLoggedIn && (
              <AuthLoginRegisterView setMenuOpen={(x) => setShowUserMenu(x)} />
            )}

            {om.state.user.isLoggedIn && (
              <VStack
                spacing
                onPressOut={(e) => {
                  close()
                }}
              >
                <LinkButton {...flatButtonStyle} name="adminTags">
                  <Settings
                    size={16}
                    opacity={0.25}
                    style={{ marginRight: 5 }}
                  />
                  Admin
                </LinkButton>

                <LinkButton
                  {...flatButtonStyle}
                  name="user"
                  params={{
                    username: slugify(om.state.user.user?.username ?? ''),
                  }}
                >
                  Profile
                </LinkButton>
                <Divider />
                <LinkButton
                  onPress={() => {
                    Toast.show(`Logging out...`)
                    setTimeout(() => {
                      om.actions.user.logout()
                    }, 1000)
                  }}
                >
                  Logout
                </LinkButton>
              </VStack>
            )}
          </Box>
        }
      >
        <Tooltip contents={om.state.user.isLoggedIn ? 'User' : 'Login'}>
          <MenuButton
            Icon={User}
            onPress={() => setShowUserMenu(!showUserMenu)}
            text={!isSmall && !om.state.user.isLoggedIn ? 'Signup' : ''}
          />
        </Tooltip>
      </Popover>

      {isAboveMedium && (
        <>
          <Tooltip contents="About">
            <MenuButton
              name="about"
              Icon={Coffee}
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

const MenuButton = ({
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
      opacity={0.65}
      activeStyle={{
        opacity: 1,
        transform: [{ scale: 1.1 }],
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
