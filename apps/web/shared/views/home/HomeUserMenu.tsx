import React, { memo } from 'react'
import { Text } from 'react-native'

import { useOvermind } from '../../state/om'
import { AuthLoginRegisterView } from '../auth/AuthLoginRegisterView'
import { Divider } from '../shared/Divider'
import { Icon } from '../shared/Icon'
import { LinkButton } from '../shared/Link'
import { Popover } from '../shared/Popover'
import { HStack, VStack } from '../shared/Stacks'
import { Tooltip } from '../shared/Tooltip'
import { flatButtonStyle } from './baseButtonStyle'

export const HomeUserMenu = memo(() => {
  const om = useOvermind()

  return (
    <>
      <Popover
        position="bottom"
        isOpen={om.state.home.showUserMenu}
        onClickOutside={() => {
          om.actions.home.setShowUserMenu(false)
        }}
        contents={
          <Tooltip padding={20} width="30vw" minWidth={250}>
            {!om.state.auth.is_logged_in && (
              <AuthLoginRegisterView
                setMenuOpen={(x) => om.actions.home.setShowUserMenu(x)}
              />
            )}

            {om.state.auth.is_logged_in && (
              <VStack spacing>
                <LinkButton
                  {...flatButtonStyle}
                  name="account"
                  params={{ id: 'reviews', pane: 'list' }}
                >
                  Reviews
                </LinkButton>
                <Divider />
                <LinkButton
                  name="home"
                  onPress={() => om.actions.auth.logout()}
                >
                  Logout
                </LinkButton>
              </VStack>
            )}
          </Tooltip>
        }
      >
        <LinkButton
          flexDirection="row"
          pointerEvents="auto"
          padding={15}
          onPress={() =>
            om.actions.home.setShowUserMenu(!om.state.home.showUserMenu)
          }
        >
          <HStack spacing alignItems="center" justifyContent="center">
            <Icon name="user" size={26} opacity={0.5} />
            {om.state.auth.is_logged_in ? (
              <Text
                numberOfLines={1}
                style={{ fontSize: 12, opacity: 0.5, maxWidth: 50 }}
              >
                {om.state.auth.user.username}
              </Text>
            ) : null}
          </HStack>
        </LinkButton>
      </Popover>
    </>
  )
})
