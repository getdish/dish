import { Clock, ShoppingBag } from '@dish/react-feather'
import React, { useEffect, useState } from 'react'
import { VStack } from 'snackui'

import { tagDisplayNames } from '../../constants/tagMeta'
import { rgbString } from '../../helpers/rgb'
import { NavigableTag } from '../../types/tagTypes'
import { useCurrentLenseColor } from '../hooks/useCurrentLenseColor'
import { Link } from './Link'
import { SmallButton, SmallButtonProps } from './SmallButton'

type FilterButtonProps = SmallButtonProps & {
  tag: NavigableTag
}

export const FilterButton = ({
  tag,
  color,
  index = 0,
  isActive: isActiveParent,
  ...rest
}: FilterButtonProps & {
  index?: number
  color?: string
  isActive?: boolean
}) => {
  const { name, rgb } = useCurrentLenseColor()
  const [isActive, setIsActive] = useState(isActiveParent)
  const themeName = isActive ? `${name}-dark` : null
  color = color ?? rgbString(rgb)

  useEffect(() => {
    setIsActive(isActiveParent)
  }, [isActiveParent])

  const iconElement = (() => {
    switch (tag.slug) {
      case 'filters__open':
        return <Clock size={18} color={color} />
      case 'filters__delivery':
        return <ShoppingBag size={18} color={color} />
      default:
        return null
    }
  })()

  return (
    <Link tag={tag} asyncClick>
      <SmallButton
        icon={iconElement ? <VStack opacity={0.45}>{iconElement}</VStack> : null}
        {...rest}
        zIndex={100 - index + (isActive ? 1 : 0)}
        theme={themeName}
        textProps={{
          fontWeight: '700',
          ...(isActive && {
            color: color,
          }),
          ...rest.textProps,
        }}
        onPress={() => {
          setIsActive((x) => !x)
        }}
      >
        {rest.children ?? (tag.name ? tagDisplayNames[tag.name] : null) ?? tag.name}
      </SmallButton>
    </Link>
  )
}
