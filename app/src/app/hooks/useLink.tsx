import { isWeb } from '../../constants/constants'
import { addTagsToCache, allTags, getFullTagFromNameAndType } from '../../helpers/allTags'
import { getNavigateItemForState } from '../../helpers/getNavigateItemForState'
import { getNextHomeState } from '../../helpers/getNextHomeState'
import { filterToNavigable } from '../../helpers/tagHelpers'
import { NavigateItem, router } from '../../router'
import { homeStore } from '../homeStore'
import { userStore } from '../userStore'
import { LinkButtonProps, LinkProps } from '../views/LinkProps'
import { series, sleep } from '@dish/async'
import { SizableText, useEvent, useForceUpdate } from '@dish/ui'
import { isEqual, omit } from 'lodash'
import React, { useEffect, useRef } from 'react'
import { Pressable } from 'react-native'

export const useLink = (props: LinkProps<any, any>, styleProps?: any, asChild?: boolean) => {
  const forceUpdate = useForceUpdate()
  const linkProps = getNormalizeLinkProps(props as any, forceUpdate)
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

  const onPress = useEvent((e: any) => {
    const justDragged = false
    // const justDragged = Date.now() - getLastDrag() < 100
    if (justDragged) {
      e.preventDefault()
      e.stopPropagation()
      console.warn('just dragged')
      return
    }
    if (props.stopPropagation) {
      e.stopPropagation()
    }
    const shouldPrevent = props.promptLogin ? userStore.promptLogin() : false
    if (shouldPrevent) {
      e.preventDefault()
      e.stopPropagation()
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
    const newLinkProps = getNormalizeLinkProps(props as any, forceUpdate)
    if (props.asyncClick) {
      cancel.current = series([
        // just enough time to do a lil animation, but not enough to slow the action, hard to get right
        () => sleep(100),
        () => {
          cancel.current = null
          onPressCallback(navItem, newLinkProps, props, e)
        },
      ])
    } else {
      onPressCallback(navItem, newLinkProps, props, e)
    }
  })

  return {
    onPress,
    navItem,
    wrapWithLinkElement(children: any, ref?: any) {
      if (isWeb) {
        const element = props.tagName ?? 'a'
        const href = props.href ?? router.getPathFromParams(navItem)
        const webProps = {
          ref,
          onPress,
          className: asChild
            ? props.className
            : `a-link ${
                props.disableDisplayContents ? '' : 'display-contents'
              } cursor-pointer ${props.className ?? ''}`,
          target: props.target,
          ...(element === 'a' &&
            href && {
              href,
              onMouseEnter: linkProps.onMouseEnter,
            }),
        }

        return (
          <SizableText asChild={asChild} {...webProps}>
            {children}
          </SizableText>
        )
      }

      if (asChild) {
        return React.cloneElement(children, {
          onPress,
          ...styleProps,
        })
      }

      // return children
      return (
        <Pressable
          ref={ref}
          style={styleProps}
          onStartShouldSetResponderCapture={() => true}
          onPress={onPress}
        >
          {children}
        </Pressable>
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

    nextState['debug'] = props['debug']

    return {
      ...(nextState && getNavigateItemForState(nextState, homeStore.currentState)),
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

function onPressCallback(navItem: any, linkProps: any, props: any, e: any) {
  if (linkProps.onPress || props.onClick) {
    e.navigate = () => router.navigate(navItem)
    if (props.onClick !== linkProps.onPress) {
      props.onClick?.(e!)
    }
    linkProps.onPress?.(e)
  } else {
    if (!props.preventNavigate && !!navItem.name) {
      router.navigate(navItem)
    }
  }
}
