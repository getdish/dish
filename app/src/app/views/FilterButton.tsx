import { tagDisplayNames } from '../../constants/tagMeta'
import { NavigableTag } from '../../types/tagTypes'
import { resetResults } from '../home/search/SearchPageStore'
import { useCurrentLenseColor } from '../hooks/useCurrentLenseColor'
import { Link } from './Link'
import { SmallButton, SmallButtonProps } from './SmallButton'
import { Clock, ShoppingBag } from '@tamagui/feather-icons'
import React, { useEffect, useState } from 'react'

type FilterButtonProps = Omit<SmallButtonProps, 'tag'> & {
  tag: NavigableTag
}

export const FilterButton = ({
  tag,
  index = 0,
  isActive: isActiveParent,
  ...rest
}: FilterButtonProps & {
  index?: number
  isActive?: boolean
}) => {
  const { name } = useCurrentLenseColor()
  const [isActive, setIsActive] = useState(isActiveParent)

  useEffect(() => {
    setIsActive(isActiveParent)
  }, [isActiveParent])

  const IconComponent = (() => {
    switch (tag.slug) {
      case 'filters__open':
        return Clock
      case 'filters__delivery':
        return ShoppingBag
      default:
        return undefined
    }
  })()

  return (
    <Link tag={tag} replace asyncClick>
      <SmallButton
        theme={name}
        icon={IconComponent}
        {...rest}
        zIndex={100 - index + (isActive ? 1 : 0)}
        // borderWidth={0}
        bc="$bg2"
        hoverStyle={{
          bc: '$bg3',
        }}
        textProps={{
          fontWeight: '700',
          color: isActive ? '#fff' : undefined,
          ...rest.textProps,
        }}
        onPress={() => {
          resetResults()
          setIsActive((x) => !x)
        }}
      >
        {rest.children ?? (tag.name ? tagDisplayNames[tag.name] : null) ?? tag.name}
      </SmallButton>
    </Link>
  )
}
