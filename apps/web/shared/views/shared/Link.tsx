import React from 'react'
import { useOvermind } from '../../state/om'
import { RouteName, RoutesTable } from '../../state/router'

export function Link<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>({
  name,
  params,
  ...props
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {
  name: Name
  params?: Params
}) {
  const om = useOvermind()
  return (
    <a
      href={`/${name}/`} // todo
      onClick={e => {
        e.preventDefault()
        om.actions.router.navigate({ name, params } as any)
      }}
      {...props}
    />
  )
}
