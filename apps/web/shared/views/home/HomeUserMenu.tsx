import { SimpleLineIcons } from '@expo/vector-icons'
import React, { memo, useState } from 'react'
import { LinkButton } from '../shared/Link'
import { Popover } from '../shared/Popover'
import { Tooltip } from './Tooltip'
import { LabAuth } from '../auth'

export const HomeUserMenu = memo(() => {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <Popover
      position="bottom"
      isOpen={isOpen}
      target={
        <LinkButton
          backgroundColor="#fff"
          padding={15}
          width={15 * 2 + 16}
          height={15 * 2 + 16}
          borderRadius={100}
          shadowColor="rgba(0,0,0,0.2)"
          shadowRadius={10}
          shadowOffset={{ width: 0, height: 5 }}
          onPress={() => setIsOpen(!isOpen)}
        >
          <SimpleLineIcons name="user" size={16} style={{ opacity: 0.5 }} />
        </LinkButton>
      }
    >
      <Tooltip padding={20}>
        <LabAuth />
      </Tooltip>
    </Popover>
  )
})
