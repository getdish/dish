import React from 'react'
import { useOvermind } from '../../state/om'
import { RouteName, RoutesTable } from '../../state/router'

export function Link<A extends RouteName, B extends RoutesTable[A]['params']>({
  name: A,
  params,
  ...props
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {
  name: RouteName
  params?: B
}) {
  const om = useOvermind()
  return (
    <a
      href={`/${name}/`} // todo
      onClick={e => {
        e.preventDefault()
        om.actions.router.navigate({ name, params })
      }}
      {...props}
    />
  )
}
