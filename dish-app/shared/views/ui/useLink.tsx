import { isPresent } from '@dish/helpers'
import { NavigateItem } from '@dish/router'
import { series, sleep } from '@o/async'
import { isEqual, omit } from 'lodash'
import React, { useEffect, useRef } from 'react'
import { Platform, TouchableOpacity } from 'react-native'
import { useForceUpdate } from 'snackui'

import { isWeb } from '../../constants'
import { memoize } from '../../helpers/memoizeWeak'
import {
  addTagsToCache,
  allTags,
  getFullTagFromNameAndType,
} from '../../state/allTags'
import { getNavigateItemForState } from '../../state/getNavigateItemForState'
import { getNextState } from '../../state/getNextState'
import { HomeStateNav } from '../../state/home-types'
import { NavigableTag } from '../../state/NavigableTag'
import { omStatic } from '../../state/omStatic'
import { router } from '../../state/router'
import { LinkProps } from './LinkProps'
import { LinkButtonProps } from './LinkProps'
import { nav } from './nav'

export const useLink = (props: LinkProps<any, any>) => {
  const forceUpdate = useForceUpdate()
  const linkProps = getNormalizeLinkProps(props, forceUpdate)
  const cancel = useRef<Function | null>(null)
  const navItem: NavigateItem = {
    name: linkProps.name,
    params: linkProps.params,
    replace: linkProps.replace,
  }

  useEffect(() => {
    return () => {
      cancel.current?.()
    }
  }, [])

  const onPress = (e: any) => {
    if (isWeb) {
      if (props.href || e.metaKey || e.ctrlKey) {
        window.open(props.href ?? e.currentTarget.href, '_blank')
        return
      }
    }

    e.preventDefault()
    if (props.stopPropagation) {
      e.stopPropagation()
    }

    const newLinkProps = getNormalizeLinkProps(props, forceUpdate)

    if (props.asyncClick) {
      cancel.current = series([
        () => sleep(50),
        () => {
          cancel.current = null
          nav(navItem, newLinkProps, props, e)
        },
      ])
    } else {
      nav(navItem, newLinkProps, props, e)
    }
  }

  return {
    onPress,
    navItem,
    wrapWithLinkElement(children: any) {
      if (Platform.OS === 'web') {
        const element = props.tagName ?? 'a'
        return React.createElement(
          element,
          {
            onClick: onPress,
            className: `display-contents dish-link ${props.className ?? ''}`,
            target: props.target,
            ...(element === 'a' && {
              href: props.href ?? router.getPathFromParams(navItem),
              onMouseEnter: linkProps.onMouseEnter,
            }),
          },
          children
        )
      }
      return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
    },
  }
}

const getNormalizeLinkProps = memoize(
  (
    props: Partial<LinkButtonProps>,
    forceUpdate: Function
  ): LinkButtonProps & { params?: Object; onMouseEnter?: any } => {
    const linkProps = getNormalizedLink(props)
    const next = {
      ...props,
      ...linkProps,
      onMouseEnter,
    }
    delete next['tag']
    delete next['tags']
    return next
    function onMouseEnter(e) {
      // get latest on mouseenter, lets you update tags without re-rendering every link
      const next = getNormalizedLink(props)
      if (!isEqual(omit(next, 'onPress'), omit(linkProps, 'onPress'))) {
        forceUpdate()
      }
      props['onMouseEnter']?.(e)
    }
  }
)

const getNormalizedLink = (props: Partial<LinkButtonProps>) => {
  if (props.tags || props.tag) {
    const tags: NavigableTag[] = (props.tags ?? [props.tag])
      .filter(isPresent)
      .map((tag) => {
        // TEMP bugfix, until we do new home, we need to fallback to getFullTagFromNameAndType
        return tag.slug
          ? allTags[tag.slug] ?? tag
          : getFullTagFromNameAndType(tag as any) ?? tag
      })

    // add to cache
    addTagsToCache(tags)

    const nextState = getNextState({
      ...props,
      state: omStatic.state.home.currentState,
      tags,
    })
    return {
      ...(nextState && getNavigateItemForState(omStatic, nextState)),
      preventNavigate: true,
      onPress() {
        omStatic.actions.home.navigate({
          state: omStatic.state.home.currentState,
          tags,
        })
      },
    }
  }
  return props
}

// for easy use with Link / LinkButton
const getNavigateTo = (props: HomeStateNav): LinkButtonProps | null => {
  return null
}
