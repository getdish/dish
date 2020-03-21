import React from 'react'
import { useOvermind } from '../../state/om'
import { RoutesTable } from '../../state/router'
import { TouchableOpacity, Text } from 'react-native'
import { VStack, StackBaseProps } from './Stacks'

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

export function LinkButton<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(
  props: StackBaseProps &
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
  let restProps: StackBaseProps
  let contents: React.ReactElement
  let onPress: any

  if ('name' in props) {
    const { name, params, children, ...rest } = props
    restProps = rest
    contents = (
      <Link name={name} params={params}>
        {children}
      </Link>
    )
  } else {
    const { children, onPress: onPress_, ...rest } = props
    onPress = onPress_
    restProps = rest
    contents = <Text>{children}</Text>
  }

  return (
    <VStack pointerEvents="auto">
      <TouchableOpacity onPress={onPress}>
        <VStack {...restProps}>{contents}</VStack>
      </TouchableOpacity>
    </VStack>
  )
}
