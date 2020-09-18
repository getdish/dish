import { Tag } from '@dish/graph'
import { Clock, ShoppingBag } from '@dish/react-feather'
import { VStack } from '@dish/ui'
import React, { memo } from 'react'

import { isWeb } from '../constants'
import { useIsNarrow } from '../hooks/useIs'
import { tagDisplayNames } from '../state/tagDisplayName'
import { LinkButton } from './ui/LinkButton'
import { LinkButtonProps } from './ui/LinkProps'
import { SmallButton } from './ui/SmallButton'

export const FilterButton = memo(
  ({
    tag,
    isActive,
    zIndex,
    position,
    margin,
    flex,
    ...rest
  }: LinkButtonProps & { tag: Tag; isActive: boolean }) => {
    const isSmall = useIsNarrow()
    let content: any = rest.children ?? tagDisplayNames[tag.name] ?? tag.name

    if (isSmall) {
      switch (content) {
        case 'Open':
          content = <Clock size={18} />
          break
        case 'Delivery':
          content = <ShoppingBag size={18} />
          break
      }
    }

    return (
      <LinkButton {...{ zIndex, flex, position, margin }} tag={tag}>
        <SmallButton
          textStyle={{ fontSize: 13, fontWeight: '700' }}
          isActive={isActive}
          flex={flex}
          {...rest}
        >
          {content}
        </SmallButton>
      </LinkButton>
    )
  }
)
