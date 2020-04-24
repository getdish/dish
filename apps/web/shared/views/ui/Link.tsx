import './Link.css'

import React, { useCallback, useContext, useMemo } from 'react'
import { Text, TextStyle, TouchableOpacity } from 'react-native'

import { currentStates } from '../../state/home'
import { getNavigateToTag } from '../../state/home-tag-helpers'
import { useOvermind, useOvermindStatic } from '../../state/om'
import { RoutesTable, getPathFromParams } from '../../state/router'
import { NavigableTag } from '../../state/Tag'
import { CurrentStateID } from '../home/CurrentStateID'
import { StackProps, VStack } from './Stacks'

type LinkSharedProps = {
  fontWeight?: TextStyle['fontWeight']
  fontSize?: TextStyle['fontSize']
  lineHeight?: TextStyle['lineHeight']
  ellipse?: boolean
  fastClick?: boolean
  replace?: boolean
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
  padding,
  color,
  onClick,
  replace,
  ...props
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> &
  LinkSharedProps & {
    name: Name
    params?: Params
    inline?: boolean
    padding?: StackProps['padding']
  }) {
  const om = useOvermindStatic()
  const handler = useCallback((e) => {
    e.stopPropagation()
    e.preventDefault()
    om.actions.router.navigate({ name, params, replace } as any)
    onClick?.(e)
  }, [])

  return (
    <a
      {...props}
      href={getPathFromParams({ name, params })}
      onMouseDown={prevent}
      onClick={prevent}
      {...{
        [fastClick ? 'onMouseDown' : 'onClick']: handler,
      }}
      className={`${inline ? 'inline-flex' : ' flex'}`}
      style={{ maxWidth: '100%', flex: 1, padding }}
    >
      <Text
        numberOfLines={ellipse ? 1 : undefined}
        style={
          { fontSize, lineHeight, fontWeight, display: 'inherit', color } as any
        }
      >
        {children}
      </Text>
    </a>
  )
}

const prevent = (e) => [e.preventDefault(), e.stopPropagation()]

export type LinkButtonProps<Name = any, Params = any> = StackProps &
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
    | {
        tag: NavigableTag
      }
  )

export function LinkButton<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(allProps: LinkButtonProps<Name, Params>) {
  const currentStateID = useContext(CurrentStateID)
  let restProps: StackProps
  let contents: React.ReactElement
  let pointerEvents: any
  let onPress: any
  let fastClick: boolean
  let props = { ...allProps }

  if ('tag' in props) {
    if (props.tag.name !== 'Search') {
      const state = currentStates.find((x) => x.id === currentStateID)
      const tagProps = getNavigateToTag(window['om'], {
        state,
        tag: props.tag,
      })
      props = { ...props, ...tagProps }
    }
    delete props['tag']
  }

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
      padding,
      paddingVertical,
      paddingHorizontal,
      replace,
      ...rest
    } = props
    pointerEvents = rest.pointerEvents
    restProps = rest
    contents = (
      <Link
        name={name}
        params={params}
        replace={replace}
        onClick={onPress}
        lineHeight={lineHeight}
        fontSize={fontSize}
        fontWeight={fontWeight}
        ellipse={ellipse}
        fastClick={fastClick}
        padding={getStylePadding({
          padding,
          paddingVertical,
          paddingHorizontal,
        })}
      >
        {children ?? ''}
      </Link>
    )
  } else {
    const {
      children,
      // @ts-ignore
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
    <VStack
      // @ts-ignore
      display="inherit"
      flex={props.flex}
      pointerEvents={pointerEvents ?? null}
    >
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

export function OverlayLinkButton<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(props: LinkButtonProps<Name, Params>) {
  return (
    <LinkButton
      backgroundColor="#fff"
      paddingVertical={10}
      paddingHorizontal={16}
      borderRadius={90}
      shadowColor="rgba(0,0,0,0.175)"
      shadowRadius={13}
      shadowOffset={{ width: 0, height: 3 }}
      overflow="hidden"
      {...props}
    />
  )
}

const getStylePadding = ({
  padding,
  paddingHorizontal,
  paddingVertical,
}: {
  padding: any
  paddingVertical: any
  paddingHorizontal: any
}) => {
  if (paddingHorizontal || paddingVertical) {
    return [paddingVertical ?? padding ?? 0, paddingHorizontal ?? padding ?? 0]
      .map((x) => (typeof x === 'number' ? `${x}px` : x))
      .join(' ')
  }
  return padding
}
