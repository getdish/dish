import { Clock, ShoppingBag } from '@dish/react-feather'
import React, { useEffect, useState } from 'react'
import { VStack } from 'snackui'

import { isWeb } from '../../constants/constants'
import { tagDisplayNames } from '../../constants/tagMeta'
import { rgbString } from '../../helpers/rgbString'
import { NavigableTag } from '../../types/tagTypes'
import { useCurrentLenseColor } from '../hooks/useCurrentLenseColor'
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

  const iconElement = (() => {
    switch (tag.slug) {
      case 'filters__open':
        return <Clock size={18} color={isWeb ? 'var(--color)' : '#000'} />
      case 'filters__delivery':
        return <ShoppingBag size={18} color={isWeb ? 'var(--color)' : '#000'} />
      default:
        return null
    }
  })()

  return (
    <SmallButton
      tag={tag}
      icon={iconElement ? <VStack opacity={0.45}>{iconElement}</VStack> : null}
      {...rest}
      zIndex={100 - index + (isActive ? 1 : 0)}
      theme={themeName}
      textProps={{
        fontWeight: '600',
        fontSize: 16,
        color: isActive ? '#fff' : rgbString(rgb),
        ...rest.textProps,
      }}
      onPressOut={() => {
        setIsActive((x) => !x)
      }}
    >
      {rest.children ?? (tag.name ? tagDisplayNames[tag.name] : null) ?? tag.name}
    </SmallButton>
  )
}
