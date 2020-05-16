import './Link.css'

import _ from 'lodash'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { Platform, Text, TextStyle, TouchableOpacity } from 'react-native'

import { currentStates } from '../../state/home'
import { getNavigateToTags } from '../../state/home-tag-helpers'
import {
  NavigateItem,
  RouteName,
  RoutesTable,
  getPathFromParams,
} from '../../state/router'
import { NavigableTag } from '../../state/Tag'
import { useOvermindStatic } from '../../state/useOvermind'
import { CurrentStateID } from '../home/CurrentStateID'
import { getNode } from './getNode'
import { StackProps, VStack } from './Stacks'

type LinkSharedProps = {
  fontWeight?: TextStyle['fontWeight']
  fontSize?: TextStyle['fontSize']
  lineHeight?: TextStyle['lineHeight']
  ellipse?: boolean
  fastClick?: boolean
  replace?: boolean
  stopPropagation?: boolean
  disabledIfActive?: boolean
  tagName?: string
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
    tagName,
    ...restProps
  } = allProps
  const linkProps = useNormalizeLinkProps(allProps as any)
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
      prevent(e)
      if (onClick) {
        onClick?.(e)
      }
      if ('onPress' in linkProps) {
        linkProps?.onPress?.()
      }
      om.actions.router.navigate(navItem)
    },
    [navItem, onClick]
  )

  const elementName = tagName ?? 'a'
  const props = {
    href: getPathFromParams(navItem),
    ...restProps,
    onMouseDown: prevent,
    onClick: prevent,
    [fastClick ? 'onMouseDown' : 'onClick']: handler,
    className: `${inline ? 'inline-flex' : ' flex'}`,
    style: {
      cursor: 'pointer',
      maxWidth: '100%',
      flex: 1,
      padding,
    },
  }
  const content = (
    <Text
      numberOfLines={ellipse ? 1 : undefined}
      style={
        {
          fontSize,
          lineHeight,
          fontWeight,
          display: 'inherit',
          color,
        } as any
      }
    >
      {children}
    </Text>
  )

  return React.createElement(elementName, props, content)
}

const prevent = (e) => [e.preventDefault(), e.stopPropagation()]

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
    | {
        tag: NavigableTag
        onPress?: Function
      }
    | {
        tags: NavigableTag[]
        onPress?: Function
      }
  )

const useNormalizeLinkProps = (
  props: Partial<LinkButtonProps>
): LinkButtonProps => {
  const normalized = useNormalizedLink(props)
  const next = { ...props, ...normalized }
  if ('tag' in next) {
    delete next['tag']
  }
  if ('tags' in next) {
    delete next['tags']
  }
  return next
}

const asyncLinkAction = (cb?: Function) => (e) => {
  e.persist()
  e?.preventDefault()
  e?.stopPropagation()
  setTimeout(() => {
    cb?.(e)
  })
}

const useNormalizedLink = (
  props: Partial<LinkButtonProps>
): LinkButtonNamedProps => {
  const currentStateID = useContext(CurrentStateID)
  let tags: NavigableTag[] = []

  if ('tag' in props && !!props.tag) {
    if (props.tag.name !== 'Search') {
      tags.push(props.tag)
    }
  }
  if ('tags' in props && Array.isArray(props.tags)) {
    tags = props.tags
  }

  if (tags.length) {
    const state = currentStates.find((x) => x.id === currentStateID)
    const tagProps = getNavigateToTags(window['om'], {
      state,
      tags,
      disabledIfActive: props.disabledIfActive,
    })
    return {
      ...tagProps,
      onPress: asyncLinkAction((e) => {
        tagProps.onPress?.(e)
        props.onPress?.(e)
      }),
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
  const containerRef = useRef()
  const stopProp = allProps.stopPropagation ?? true

  useEffect(() => {
    if (Platform.OS === 'web') {
      if (stopProp && containerRef.current) {
        const div = getNode(containerRef.current)
        if (div) {
          div.addEventListener('click', prevent)
          return () => div.removeEventListener('click', prevent)
        }
      }
    }
  }, [containerRef.current, stopProp])

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
      disabledIfActive,
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
      disabledIfActive,
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

  const onPressCb = useMemo(() => asyncLinkAction(onPress), [onPress])

  const {
    top,
    left,
    right,
    bottom,
    position,
    alignSelf,
    margin,
    ...restRestProps
  } = restProps

  return (
    // NOTE: display inherit, this is to allow turning off pointer events...
    <VStack
      // @ts-ignore
      display="inherit"
      pointerEvents={pointerEvents ?? null}
      // only handle click events on non-a links (we handle them in Link separately)
      ref={'name' in props ? null : containerRef}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        {...(!!onPress && { [fastClick ? 'onPressIn' : 'onPress']: onPressCb })}
        style={{
          top,
          left,
          right,
          bottom,
          position,
          alignSelf,
          margin,
        }}
      >
        <VStack
          flex={typeof props.flex === 'undefined' ? 1 : props.flex}
          {...restRestProps}
        >
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
      paddingVertical={9}
      paddingHorizontal={14}
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
