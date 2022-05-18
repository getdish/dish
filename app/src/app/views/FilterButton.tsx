import { tagDisplayNames } from '../../constants/tagMeta'
import { NavigableTag } from '../../types/tagTypes'
import { resetResults } from '../home/search/SearchPageStore'
import { useCurrentLenseColor } from '../hooks/useCurrentLenseColor'
import { Link } from './Link'
import { SmallButton, SmallButtonProps } from './SmallButton'
import { Button } from '@dish/ui'
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
      <Button
        icon={IconComponent}
        {...rest}
        zIndex={100 - index + (isActive ? 1 : 0)}
        {...(isActive && {
          theme: 'active',
        })}
        onPress={() => {
          resetResults()
          setIsActive((x) => !x)
        }}
      >
        {rest.children ?? (tag.name ? tagDisplayNames[tag.name] : null) ?? tag.name}
      </Button>
    </Link>
  )
}
