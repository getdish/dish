import { series, sleep } from '@dish/async'
import { isEqual, omit } from 'lodash'
import React, { useEffect, useRef } from 'react'
import { TouchableOpacity, useForceUpdate } from 'snackui'

import { isWeb } from '../../constants/constants'
import { addTagsToCache, allTags, getFullTagFromNameAndType } from '../../helpers/allTags'
import { getNavigateItemForState } from '../../helpers/getNavigateItemForState'
import { getNextHomeState } from '../../helpers/getNextHomeState'
import { filterToNavigable } from '../../helpers/tagHelpers'
import { NavigateItem, router } from '../../router'
import { homeStore } from '../homeStore'
import { userStore } from '../userStore'
import { LinkButtonProps, LinkSharedProps } from '../views/LinkProps'

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
    console.log('press')
    if (props.stopPropagation) {
      e.stopPropagation()
    }

    if (props.promptLogin && userStore.promptLogin()) {
      e.preventDefault()
      return
    }

    if (isWeb) {
      if (props.preventNavigate) {
        return
      }
      e.preventDefault()
      if (props.href || e.metaKey || e.ctrlKey) {
        window.open(props.href ?? e.currentTarget.href, '_blank')
        return
      }
    }

    e.preventDefault()

    const newLinkProps = getNormalizeLinkProps(props, forceUpdate)

    if (props.asyncClick) {
      cancel.current = series([
        () => sleep(10),
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
      if (isWeb) {
        const element = props.tagName ?? 'a'
        const href = props.href ?? router.getPathFromParams(navItem)
        return React.createElement(
          element,
          {
            onClick: onPress,
            className: `display-contents cursor-pointer ${props.className ?? ''}`,
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
      // return children
      return (
        <TouchableOpacity onStartShouldSetResponderCapture={() => true} onPress={onPress}>
          {children}
        </TouchableOpacity>
      )
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
    // get latest on mouseenter, lets you update tags without re-rendering every link
    onMouseEnter(e) {
      const next = getNormalizedLink(props)
      if (!isEqual(omit(next, 'onPress'), omit(linkProps, 'onPress'))) {
        forceUpdate()
      }
      props['onMouseEnter']?.(e)
    },
  }
  delete next['tag']
  delete next['tags']
  delete next['asyncClick']
  return next
}

// dont memoize relies on homeStore.currentState
const getNormalizedLink = (props: Partial<LinkButtonProps>) => {
  if (props.tags || props.tag) {
    const tags = filterToNavigable(props.tags ?? (props.tag ? [props.tag] : [])).map((tag) => {
      // TEMP bugfix, until we do new home, we need to fallback to getFullTagFromNameAndType
      if (!tag.slug) {
        console.warn('no slug?')
        return getFullTagFromNameAndType(tag as any) ?? tag
      }
      return {
        // TODO ideally our data is cleaner, no need for this
        // default to dish which is important! used later
        // by searchPageStore.runSearch to pick out dish tag
        // @ts-ignore
        type: 'dish',
        ...(allTags[tag.slug] ?? tag),
      }
    })

    // add to cache
    addTagsToCache(tags)

    const nextState = getNextHomeState({
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
  console.log('navigate', navItem)
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
