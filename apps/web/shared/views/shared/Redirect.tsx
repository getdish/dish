import React, { useEffect } from 'react'
import { useOvermind } from '../../state/om'

export function Redirect(props: { to: string }) {
  const om = useOvermind()
  const cur = om.state.router.curPage.path
  const next = props.to

  useEffect(() => {
    if (next != cur) {
      om.actions.router.navigate(props.to)
    }
  }, [next, cur])

  return null
}
