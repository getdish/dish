import { series, sleep } from '@dish/async'
import { isPresent } from '@dish/helpers'
import { isEqual, omit } from 'lodash'
import React, { useEffect, useRef } from 'react'
import { Platform, TouchableOpacity } from 'react-native'
import { useForceUpdate } from 'snackui'

import { isWeb } from '../../constants/constants'
import {
  addTagsToCache,
  allTags,
  getFullTagFromNameAndType,
} from '../../helpers/allTags'
import { getNavigateItemForState } from '../../helpers/getNavigateItemForState'
import { getNextState } from '../../helpers/getNextState'
import { memoize } from '../../helpers/memoizeWeak'
import { tagsToNavigableTags } from '../../helpers/tagHelpers'
import { NavigateItem, router } from '../../router'
import { homeStore } from '../homeStore'
import { LinkButtonProps, LinkProps, LinkSharedProps } from '../views/LinkProps'

export const useLink = (
  props: LinkSharedProps & { name?: any; params?: any; tagName?: string }
) => {
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
        if (props.preventNavigate) {
          return
        }
        e.preventDefault()
        e.stopPropagation()
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
          doNavigate(navItem, newLinkProps, props, e)
        },
      ])
    } else {
      doNavigate(navItem, newLinkProps, props, e)
    }
  }

  return {
    onPress,
    navItem,
    wrapWithLinkElement(children: any) {
      if (Platform.OS === 'web') {
        const element = props.tagName ?? 'a'
        const href = props.href ?? router.getPathFromParams(navItem)
        return React.createElement(
          element,
          {
            onClick: onPress,
            className: `display-contents dish-link ${props.className ?? ''}`,
            target: props.target,
            ...(element === 'a' &&
              href && {
                href,
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

// dont memoize relies on homeStore.currentState
const getNormalizeLinkProps = (
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
    console.log('we got a new one', next)
    if (!isEqual(omit(next, 'onPress'), omit(linkProps, 'onPress'))) {
      forceUpdate()
    }
    props['onMouseEnter']?.(e)
  }
}

// dont memoize relies on homeStore.currentState
const getNormalizedLink = (props: Partial<LinkButtonProps>) => {
  if (props.tags || props.tag) {
    const tags = tagsToNavigableTags(
      props.tags ?? (props.tag ? [props.tag] : [])
    )
      .filter(isPresent)
      .map((tag) => {
        // TEMP bugfix, until we do new home, we need to fallback to getFullTagFromNameAndType
        if (!tag.slug) {
          console.warn('no slug?')
          return getFullTagFromNameAndType(tag as any) ?? tag
        }
        return allTags[tag.slug] ?? tag
      })

    // add to cache
    addTagsToCache(tags)

    const nextState = getNextState({
      ...props,
      state: homeStore.currentState,
      tags,
    })

    return {
      ...(nextState && getNavigateItemForState(nextState)),
      ...(!props.preventNavigate && {
        preventNavigate: true,
        onPress() {
          homeStore.navigate({
            state: homeStore.currentState,
            tags,
          })
        },
      }),
    }
  }
  return props
}

function doNavigate(navItem: any, linkProps: any, props: any, e: any) {
  if (linkProps.onPress || props.onClick) {
    e.navigate = () => router.navigate(navItem)
    props.onClick?.(e!)
    linkProps.onPress?.(e)
  } else {
    if (!props.preventNavigate && !!navItem.name) {
      router.navigate(navItem)
    }
  }
}
