import './Link.css'

import _ from 'lodash'
import React, { useCallback, useContext, useMemo } from 'react'
import { Text, TextStyle, TouchableOpacity } from 'react-native'

import { currentStates } from '../../state/home'
import { getNavigateToTag } from '../../state/home-tag-helpers'
import { useOvermindStatic } from '../../state/om'
import {
  NavigateItem,
  RouteName,
  RoutesTable,
  getPathFromParams,
} from '../../state/router'
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

type LinkProps<A, B> = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> &
  LinkSharedProps & {
    name?: A
    params?: B
    replace?: boolean
    inline?: boolean
    padding?: StackProps['padding']
    tag?: NavigableTag
  }

export function Link<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(allProps: LinkProps<Name, Params>) {
  const {
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
    ...restProps
  } = allProps
  const linkProps = useNormalizeLinkProps(allProps)
  const om = useOvermindStatic()
  const navItem: NavigateItem = useMemo(
    () => ({
      name: name ?? linkProps?.['name'],
      params: params ?? linkProps?.['params'],
      replace: replace ?? linkProps?.['replace'],
    }),
    [
      name,
      params,
      replace,
      JSON.stringify(_.pick(linkProps as any, 'name', 'params', 'replace')),
    ]
  )

  const handler = useCallback(
    (e) => {
      e.stopPropagation()
      e.preventDefault()
      if (onClick) {
        onClick?.(e)
      }
      if ('onPress' in linkProps) {
        linkProps?.onPress?.()
      } else {
        om.actions.router.navigate(navItem)
      }
    },
    [navItem, onClick]
  )

  return (
    <a
      href={getPathFromParams(navItem)}
      {...restProps}
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

type TagProp = {
  tag: NavigableTag
}

type LinkButtonNamedProps<A = any, B = any> = {
  name: A
  params?: B
  replace?: boolean
  onPress?: any
}

export type LinkButtonProps<
  Name extends RouteName = any,
  Params = any
> = StackProps &
  LinkSharedProps &
  (
    | LinkButtonNamedProps<Name, Params>
    | {
        onPress?: any
      }
    | TagProp
  )

const useNormalizeLinkProps = (
  props: Partial<LinkButtonProps>
): LinkButtonProps => {
  const normalized = useNormalizedLink(props)
  const next = { ...props, ...normalized }
  if ('tag' in next) {
    delete next['tag']
  }
  return next
}

const useNormalizedLink = (
  props: Partial<LinkButtonProps>
): LinkButtonNamedProps => {
  const currentStateID = useContext(CurrentStateID)
  if ('tag' in props && !!props.tag) {
    if (props.tag.name !== 'Search') {
      const state = currentStates.find((x) => x.id === currentStateID)
      return getNavigateToTag(window['om'], {
        state,
        tag: props.tag,
      })
    }
  }
  if ('name' in props) {
    return {
      name: props.name,
      params: props.params,
      replace: props.replace,
      onPress: props.onPress,
    }
  }
}

export function LinkButton<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(allProps: LinkButtonProps<Name, Params>) {
  let restProps: StackProps
  let contents: React.ReactElement
  let pointerEvents: any
  let onPress: any
  let fastClick: boolean
  let props = useNormalizeLinkProps(allProps)

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
      replace,
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
      paddingVertical={12}
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
