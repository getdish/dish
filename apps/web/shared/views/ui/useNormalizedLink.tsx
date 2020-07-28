import { useForceUpdate, useLazyRef } from '@dish/ui'
import { isEqual, omit } from 'lodash'
import { useMemo } from 'react'

import { memoize } from '../../helpers/memoizeWeak'
import { HomeStateItem, getNavigateTo } from '../../state/home'
import { NavigableTag } from '../../state/NavigableTag'
import { omStatic } from '../../state/useOvermind'
import { LinkButtonNamedProps, LinkButtonProps } from './LinkProps'

export const useNormalizeLinkProps = (
  props: Partial<LinkButtonProps>
): LinkButtonProps & { params?: Object } => {
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
  const { states } = omStatic.state.home
  return states[states.length - 1]
}

const useNormalizedLink = (
  linkProps: Partial<LinkButtonProps>
): LinkButtonNamedProps | null => {
  const forceUpdate = useForceUpdate()
  const propsRef = useLazyRef(() =>
    getNormalizedLink(linkProps, getLatestState())
  )
  const props = propsRef.current
  return useMemo(() => {
    if (!props) return null
    return {
      ...props,
      onMouseEnter(e) {
        const next = getNormalizedLink(props, getLatestState())
        if (
          !isEqual(omit(next, 'onPress'), omit(propsRef.current, 'onPress'))
        ) {
          propsRef.current = next
          forceUpdate()
        }
        props['onMouseEnter']?.(e)
      },
    }
  }, [props])
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
      const tagProps = getNavigateTo(omStatic, {
        state,
        tags,
        disallowDisableWhenActive: props.disallowDisableWhenActive,
        replaceSearch: props.replaceSearch,
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
