import { isPresent } from '@dish/helpers'
import { isEqual, omit } from 'lodash'

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
import { LinkButtonProps } from './LinkProps'

export const getNormalizeLinkProps = memoize(
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
