import React from 'react'
import { useOvermind } from '../../state/om'
import { RoutesTable } from '../../state/router'
import { TouchableOpacity, Text } from 'react-native'
import { VStack } from './Stacks'

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

export function DishButton<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(
  props: React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > &
    (
      | {
          name: Name
          params?: Params
        }
      | {
          onPress?: any
        }
    )
) {
  return (
    <VStack pointerEvents="auto">
      <TouchableOpacity onPress={props['onPress']}>
        {'name' in props && <Link {...props} />}
        {!('name' in props) && <Text>{props.children}</Text>}
      </TouchableOpacity>
    </VStack>
  )
}
