import { slugify } from '@dish/graph'
import { Tooltip } from '@dish/ui'
import React from 'react'

import { UserAvatar } from './home/user/UserAvatar'
import { useUserStore } from './userStore'
import { LinkButton } from './views/LinkButton'

export const UserMenuButton = () => {
  const user = useUserStore().user

  if (!user) {
    return null
  }

  return (
    <LinkButton
      tooltip="Profile"
      backgroundColor="transparent"
      position="relative"
      name="user"
      noTextWrap
      params={{
        username: slugify(user.username ?? ''),
      }}
    >
      <UserAvatar size={32} avatar={user.avatar ?? ''} charIndex={user.charIndex ?? 0} />
    </LinkButton>
  )
}
