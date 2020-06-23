import { fullyIdle } from '@dish/async'
import { useForceUpdate } from '@dish/ui'
import { isEqual, omit } from 'lodash'
import { useMemo, useRef } from 'react'

import { memoize } from '../../helpers/memoizeWeak'
import { HomeStateItem } from '../../state/home'
import { getNavigateToTags } from '../../state/home-tag-helpers'
import { NavigableTag } from '../../state/Tag'
import { omStatic } from '../../state/useOvermind'
import { LinkButtonNamedProps, LinkButtonProps } from './LinkProps'

export const useNormalizeLinkProps = (
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

const getLatestState = () => {
  const { breadcrumbStates } = omStatic.state.home
  const lastBreadcrumb = breadcrumbStates[breadcrumbStates.length - 1]
  const currentStateId = lastBreadcrumb?.id
  return omStatic.state.home.states.find((x) => x.id === currentStateId)!
}

const useNormalizedLink = (
  props: Partial<LinkButtonProps>
): LinkButtonNamedProps | null => {
  const forceUpdate = useForceUpdate()
  const cur = useRef<any>()
  if (!cur.current) {
    cur.current = getNormalizedLink(props, getLatestState())
  }
  const linkProps = cur.current
  return useMemo(() => {
    if (linkProps) {
      return {
        ...linkProps,
        onMouseEnter(e) {
          const next = getNormalizedLink(props, getLatestState())
          if (!isEqual(omit(next, 'onPress'), omit(cur.current, 'onPress'))) {
            console.log('force update new info', next, linkProps)
            cur.current = next
            forceUpdate()
          }
          props['onMouseEnter']?.(e)
        },
      }
    }
    return null
  }, [linkProps])
}

const getNormalizedLink = memoize(
  (props: Partial<LinkButtonProps>, state: HomeStateItem) => {
    let tags: NavigableTag[] = []

    if ('tags' in props && Array.isArray(props.tags)) {
      tags = props.tags
    } else if ('tag' in props && !!props.tag) {
      if (props.tag.name !== 'Search') {
        tags.push(props.tag)
      }
    }

    tags = tags.filter(Boolean)

    if (tags.length) {
      const tagProps = getNavigateToTags(omStatic, {
        state,
        tags,
        disabledIfActive: props.disabledIfActive,
      })
      return {
        onPress: props.onPress,
        ...tagProps,
        name: tagProps?.name,
      }
    }

    if ('name' in props) {
      return {
        name: props.name,
        params: props['params'],
        replace: props.replace,
        onPress: props.onPress,
      }
    }

    return null
  }
)

export const linkActionIdle = { min: 30, max: 50 }
