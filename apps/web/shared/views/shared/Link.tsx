import './Link.css'

import React, { useCallback, useMemo } from 'react'
import { Text, TextProps, TextStyle, TouchableOpacity } from 'react-native'

import { useOvermind } from '../../state/om'
import { RoutesTable, getPathFromParams } from '../../state/router'
import { StackBaseProps, VStack } from './Stacks'

type LinkSharedProps = {
  fontSize?: TextStyle['fontSize']
  ellipse?: boolean
}

export function Link<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>({
  name,
  params,
  inline,
  fontSize,
  children,
  ellipse,
  ...props
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> &
  LinkSharedProps & {
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
      className={`${inline ? 'inline-link' : ' block-link'}`}
      style={{ maxWidth: '100%' }}
    >
      <div
        className={` ${ellipse ? ' ellipse' : ''}`}
        style={fontSize ? { fontSize: `${fontSize}px` } : null}
      >
        {children}
      </div>
    </a>
  )
}

export function LinkButton<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(
  props: StackBaseProps &
    LinkSharedProps &
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
  let pointerEvents: any
  let onPress: any

  if ('name' in props) {
    const {
      name,
      params,
      children,
      onPress,
      fontSize,
      ellipse,
      ...rest
    } = props
    pointerEvents = rest.pointerEvents
    restProps = rest
    contents = (
      <Link
        name={name}
        params={params}
        onClick={onPress}
        fontSize={fontSize}
        ellipse={ellipse}
      >
        {children ?? ''}
      </Link>
    )
  } else {
    const { children, onPress: onPress_, fontSize, ellipse, ...rest } = props
    pointerEvents = rest.pointerEvents
    onPress = onPress_
    restProps = rest
    contents = (
      <Text numberOfLines={ellipse ? 1 : undefined} style={{ fontSize }}>
        {children ?? ''}
      </Text>
    )
  }

  return (
    <VStack flex={props.flex} pointerEvents={pointerEvents ?? 'auto'}>
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <VStack flex={1} {...restProps}>
          {contents}
        </VStack>
      </TouchableOpacity>
    </VStack>
  )
}
