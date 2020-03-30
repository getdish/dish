import './Link.css'

import React, { useCallback, useMemo } from 'react'
import { Text, TouchableOpacity } from 'react-native'

import { useOvermind } from '../../state/om'
import { RoutesTable, getPathFromParams } from '../../state/router'
import { StackBaseProps, VStack } from './Stacks'

export function Link<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>({
  name,
  params,
  inline,
  ...props
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {
  name: Name
  params?: Params
  inline?: boolean
}) {
  const om = useOvermind()
  return (
    <a
      {...props}
      href={getPathFromParams({ name, params })}
      onClick={useCallback((e) => {
        e.stopPropagation()
        e.preventDefault()
        om.actions.router.navigate({ name, params } as any)
      }, [])}
      className={inline ? '' : 'block-link'}
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
          onPress?: any
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
    const { name, params, children, onPress, ...rest } = props
    restProps = rest
    contents = (
      <Link name={name} params={params} onClick={onPress}>
        {children ?? ''}
      </Link>
    )
  } else {
    const { children, onPress: onPress_, ...rest } = props
    onPress = onPress_
    restProps = rest
    contents = <Text>{children ?? ''}</Text>
  }

  return (
    <VStack pointerEvents="auto">
      <TouchableOpacity onPress={onPress}>
        <VStack {...restProps}>{contents}</VStack>
      </TouchableOpacity>
    </VStack>
  )
}
