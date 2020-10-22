import { isPresent } from '@dish/helpers'
import { isEqual, omit } from 'lodash'

import { memoize } from '../../helpers/memoizeWeak'
import { allTags } from '../../state/allTags'
import { getNavigateItemForState } from '../../state/getNavigateItemForState'
import { getNextState } from '../../state/getNextState'
import { getTagId } from '../../state/getTagId'
import { HomeStateItem, HomeStateNav } from '../../state/home-types'
import { NavigableTag } from '../../state/NavigableTag'
import { omStatic } from '../../state/omStatic'
import { LinkButtonProps } from './LinkProps'

export const getNormalizeLinkProps = memoize(
  (
    props: Partial<LinkButtonProps>,
    forceUpdate: Function
  ): LinkButtonProps & { params?: Object; onMouseEnter?: any } => {
    const linkProps = getNormalizedLink(props, getLatestState())
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
      const next = getNormalizedLink(props, getLatestState())
      if (!isEqual(omit(next, 'onPress'), omit(linkProps, 'onPress'))) {
        forceUpdate()
      }
      props['onMouseEnter']?.(e)
    }
  }
)

const getLatestState = () => {
  const { states } = omStatic.state.home
  return states[states.length - 1]
}

const getNormalizedLink = (
  props: Partial<LinkButtonProps>,
  state: HomeStateItem
) => {
  let tags: NavigableTag[] = []

  if ('tags' in props && Array.isArray(props.tags)) {
    tags = props.tags
  } else if ('tag' in props && !!props.tag) {
    if (props.tag.name !== 'Search') {
      tags.push(props.tag)
    }
  }

  tags = tags.filter(isPresent).map((tag) => {
    return allTags[getTagId(tag)] ?? tag
  })

  if (tags.length) {
    const tagProps = getNavigateTo({
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

// for easy use with Link / LinkButton
const getNavigateTo = (props: HomeStateNav): LinkButtonProps | null => {
  let nextState = getNextState(props)
  if (nextState) {
    const navigateItem = getNavigateItemForState(omStatic, nextState)
    return {
      ...navigateItem,
      preventNavigate: true,
      onPress() {
        omStatic.actions.home.navigate({
          ...props,
          // use latest state
          state: omStatic.state.home.currentState,
        })
      },
    }
  }
  return null
}
