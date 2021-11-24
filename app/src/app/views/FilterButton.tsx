import { YStack, useTheme, useThemeName } from '@dish/ui'
import { Clock, ShoppingBag } from '@tamagui/feather-icons'
import React, { useEffect, useState } from 'react'

import { tagDisplayNames } from '../../constants/tagMeta'
import { rgbString } from '../../helpers/rgb'
import { NavigableTag } from '../../types/tagTypes'
import { resetResults } from '../home/search/SearchPageStore'
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
  const theme = useTheme()
  const [isActive, setIsActive] = useState(isActiveParent)
  const curThemeName = useThemeName()
  const themeName = isActive ? (curThemeName === 'dark' ? `${name}-dark` : name) : null
  color = color ?? rgbString(rgb)

  useEffect(() => {
    setIsActive(isActiveParent)
  }, [isActiveParent])

  const iconElement = (() => {
    switch (tag.slug) {
      case 'filters__open':
        return <Clock size={18} color={isActive ? '#fff' : color} />
      case 'filters__delivery':
        return <ShoppingBag size={18} color={isActive ? '#fff' : color} />
      default:
        return null
    }
  })()

  return (
    <Link tag={tag} replace asyncClick>
      <SmallButton
        icon={iconElement ? <YStack opacity={0.45}>{iconElement}</YStack> : null}
        {...rest}
        zIndex={100 - index + (isActive ? 1 : 0)}
        // borderWidth={0}
        backgroundColor={isActive ? color : theme.bg2}
        hoverStyle={{
          backgroundColor: isActive ? color : theme.bg3,
        }}
        theme={themeName}
        textProps={{
          fontWeight: '700',
          color: isActive ? '#fff' : theme.color,
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
