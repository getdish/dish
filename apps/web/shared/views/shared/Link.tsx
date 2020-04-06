import './Link.css'

import React, { useCallback, useMemo } from 'react'
import { Text, TextStyle, TouchableOpacity } from 'react-native'

import { useOvermind } from '../../state/om'
import { RoutesTable, getPathFromParams } from '../../state/router'
import { StackBaseProps, VStack } from './Stacks'

type LinkSharedProps = {
  fontWeight?: TextStyle['fontWeight']
  fontSize?: TextStyle['fontSize']
  lineHeight?: TextStyle['lineHeight']
  ellipse?: boolean
  fastClick?: boolean
}

export function Link<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>({
  name,
  params,
  inline,
  fontSize,
  fontWeight,
  children,
  ellipse,
  lineHeight,
  fastClick,
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
  const handler = useCallback((e) => {
    e.stopPropagation()
    e.preventDefault()
    om.actions.router.navigate({ name, params } as any)
  }, [])
  return (
    <a
      {...props}
      href={getPathFromParams({ name, params })}
      {...{
        [fastClick ? 'onMouseDown' : 'onClick']: handler,
      }}
      className={`${inline ? 'inline-link' : ' flex'}`}
      style={{ maxWidth: '100%' }}
    >
      <Text
        numberOfLines={ellipse ? 1 : undefined}
        style={{ fontSize, lineHeight, fontWeight, display: 'inherit' } as any}
      >
        {children}
      </Text>
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
  let fastClick: boolean

  if ('name' in props) {
    const {
      name,
      params,
      children,
      onPress,
      fontSize,
      ellipse,
      fastClick,
      lineHeight,
      fontWeight,
      ...rest
    } = props
    pointerEvents = rest.pointerEvents
    restProps = rest
    contents = (
      <Link
        name={name}
        params={params}
        onClick={onPress}
        lineHeight={lineHeight}
        fontSize={fontSize}
        fontWeight={fontWeight}
        ellipse={ellipse}
        fastClick={fastClick}
      >
        {children ?? ''}
      </Link>
    )
  } else {
    const {
      children,
      onPress: onPress_,
      fontSize,
      lineHeight,
      fontWeight,
      ellipse,
      fastClick: fastClick_,
      ...rest
    } = props
    fastClick = fastClick_
    pointerEvents = rest.pointerEvents
    onPress = onPress_
    restProps = rest
    contents = (
      <Text
        numberOfLines={ellipse ? 1 : undefined}
        style={{ fontSize, lineHeight, fontWeight }}
      >
        {children ?? ''}
      </Text>
    )
  }

  return (
    <VStack flex={props.flex} pointerEvents={pointerEvents ?? null}>
      <TouchableOpacity
        activeOpacity={0.7}
        {...{ [fastClick ? 'onPressIn' : 'onPress']: onPress }}
      >
        <VStack flex={1} {...restProps}>
          {contents}
        </VStack>
      </TouchableOpacity>
    </VStack>
  )
}
