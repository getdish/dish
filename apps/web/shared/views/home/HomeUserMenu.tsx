import React, { memo } from 'react'

import { useOvermind } from '../../state/om'
import { AuthLoginRegisterView } from '../auth/AuthLoginRegisterView'
import { Divider } from '../shared/Divider'
import { Icon } from '../shared/Icon'
import { LinkButton } from '../shared/Link'
import { Popover } from '../shared/Popover'
import { VStack } from '../shared/Stacks'
import { Tooltip } from '../shared/Tooltip'
import { flatButtonStyle } from './baseButtonStyle'

export const HomeUserMenu = memo(() => {
  const om = useOvermind()

  return (
    <Popover
      position="bottom"
      isOpen={om.state.home.showUserMenu}
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
              <LinkButton name="home" onPress={() => om.actions.auth.logout()}>
                Logout
              </LinkButton>
            </VStack>
          )}
        </Tooltip>
      }
    >
      <LinkButton
        backgroundColor="#fff"
        padding={15}
        width={15 * 2 + 16}
        height={15 * 2 + 16}
        borderRadius={100}
        shadowColor="rgba(0,0,0,0.2)"
        shadowRadius={10}
        shadowOffset={{ width: 0, height: 5 }}
        onPress={() =>
          om.actions.home.setShowUserMenu(!om.state.home.showUserMenu)
        }
      >
        <Icon name="user" size={16} opacity={0.5} />
      </LinkButton>
    </Popover>
  )
})
