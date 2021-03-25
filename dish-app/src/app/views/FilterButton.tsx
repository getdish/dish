import { Clock, ShoppingBag } from '@dish/react-feather'
import React from 'react'
import { VStack } from 'snackui'

import { isWeb } from '../../constants/constants'
import { tagDisplayNames } from '../../constants/tagMeta'
import { NavigableTag } from '../../types/tagTypes'
import { SmallButton, SmallButtonProps } from './SmallButton'

type FilterButtonProps = SmallButtonProps & {
  tag: NavigableTag
}

export const FilterButton = ({
  tag,
  color,
  ...rest
}: FilterButtonProps & {
  color?: string
}) => {
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
      textProps={{
        fontWeight: '600',
        ...(!rest.theme && {
          color,
        }),
        ...rest.textProps,
      }}
    >
      {rest.children ?? (tag.name ? tagDisplayNames[tag.name] : null) ?? tag.name}
    </SmallButton>
  )
}
