import React from 'react'
import { useOvermind } from '../../state/om'

export function Link({
  to,
  ...props
}: { to: string } & React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) {
  const om = useOvermind()
  return (
    <a
      href={to}
      onClick={e => {
        e.preventDefault()
        om.actions.router.navigate(to)
      }}
      {...props}
    />
  )
}
