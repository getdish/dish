import { DRouteName, router } from '../../router'
import { LinkButton } from './LinkButton'
import { LinkButtonProps } from './LinkProps'
import { RoutesTable } from '@dish/router'
import React, { forwardRef, useEffect, useState } from 'react'

// most the logic here comes from useLink

export const LinkButtonAutoActive = forwardRef(function LinkButtonAutoActive<
  Name extends DRouteName = DRouteName
>(
  {
    iconActive,
    ...props
  }: LinkButtonProps<Name, RoutesTable[Name]['params']> & {
    iconActive?: any
  },
  ref
) {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (props.name) {
      let last = false
      const check = (val: string) => {
        const match = val === props.name
        if (match == last) return
        setIsActive(match)
        last = match
      }
      check(router.curPage.name)
      return router.onRouteChange(() => {
        check(router.curPage.name)
      })
    }
  }, [props.name])

  return (
    <LinkButton
      ref={ref}
      isActive={isActive}
      {...props}
      icon={isActive ? iconActive : props.icon}
    />
  )
})
