import { Space, useTheme } from '@o/ui'
import React from 'react'

import { LogoVertical } from '../../views/LogoVertical'
import { SignupForm } from './SignupForm'

export const AboveFooter = (props: { hideJoin?: boolean }) => {
  const theme = useTheme()
  return (
    <>
      <LogoVertical />
      <Space size={75} />
      {!props.hideJoin && (
        <>
          <SignupForm width="80%" background={theme.backgroundStrong} borderRadius={20} />
          <Space size={75} />
        </>
      )}
    </>
  )
}
