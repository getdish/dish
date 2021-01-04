import { series, sleep } from '@dish/async'
import { isPresent } from '@dish/helpers'
import { NavigateItem } from '@dish/router'
import { isEqual, omit } from 'lodash'
import React, { useEffect, useRef } from 'react'
import { Platform, TouchableOpacity } from 'react-native'
import { useForceUpdate } from 'snackui'

import { isWeb } from '../../constants/constants'
import { memoize } from '../../helpers/memoizeWeak'
import { router } from '../../router'
import {
  addTagsToCache,
  allTags,
  getFullTagFromNameAndType,
} from '../../helpers/allTags'
import { getNavigateItemForState } from '../../helpers/getNavigateItemForState'
import { getNextState } from '../../helpers/getNextState'
import { homeStore } from '../homeStore'
import { tagsToNavigableTags } from '../../helpers/tagHelpers'
import { LinkButtonProps, LinkProps } from '../views/LinkProps'

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
        if (props.preventNavigate) {
          return
        }
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
    const tags = tagsToNavigableTags(props.tags ?? [props.tag])
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
