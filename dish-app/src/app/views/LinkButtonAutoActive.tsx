import { RoutesTable } from '@dish/router'
import React, { useEffect, useState } from 'react'

import { DRouteName, router } from '../../router'
import { LinkButton } from './LinkButton'
import { LinkButtonProps } from './LinkProps'

// most the logic here comes from useLink

export function LinkButtonAutoActive<Name extends DRouteName = DRouteName>(
  props: LinkButtonProps<Name, RoutesTable[Name]['params']>
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

  return <LinkButton isActive={isActive} {...props} />
}
