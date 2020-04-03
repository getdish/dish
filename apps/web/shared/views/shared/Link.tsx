import './Link.css'

import React, { useCallback, useMemo } from 'react'
import { Text, TextStyle, TouchableOpacity } from 'react-native'

import { useOvermind } from '../../state/om'
import { RoutesTable, getPathFromParams } from '../../state/router'
import { StackBaseProps, VStack } from './Stacks'

type LinkSharedProps = {
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
    console.log('clicking', name, params)
    om.actions.router.navigate({ name, params } as any)
  }, [])
  return (
    <a
      {...props}
      href={getPathFromParams({ name, params })}
      {...{
        [fastClick ? 'onMouseDown' : 'onClick']: handler,
      }}
      className={`${inline ? 'inline-link' : ' block-link'}`}
      style={{ maxWidth: '100%' }}
    >
      <div
        className={` ${ellipse ? ' ellipse' : ''}`}
        style={
          fontSize || lineHeight
            ? {
                fontSize:
                  typeof fontSize == 'number' ? `${fontSize}px` : fontSize,
                lineHeight:
                  typeof lineHeight == 'number'
                    ? `${lineHeight}px`
                    : lineHeight,
              }
            : null
        }
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
        style={{ fontSize, lineHeight }}
      >
        {children ?? ''}
      </Text>
    )
  }

  return (
    <VStack flex={props.flex} pointerEvents={pointerEvents ?? 'auto'}>
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
