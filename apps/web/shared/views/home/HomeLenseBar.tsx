import { HStack } from '@dish/ui'
import React, { memo } from 'react'

import { HomeActiveTagIds } from '../../state/home'
import { getTagId } from '../../state/Tag'
import { useOvermind } from '../../state/useOvermind'
import { LenseButton, LenseButtonSize } from './LenseButton'

export const HomeLenseBar = memo(
  (props: {
    activeTagIds: HomeActiveTagIds
    size?: LenseButtonSize
    minimal?: boolean
  }) => {
    const om = useOvermind()
    return (
      <HStack alignItems="center" justifyContent="center" spacing={2}>
        {om.state.home.allLenseTags.map((lense, index) => (
          <LenseButton
            key={lense.id + index}
            lense={lense}
            isActive={props.activeTagIds[getTagId(lense)]}
            minimal={props.minimal}
            size={props.size}
          />
        ))}
      </HStack>
    )
  }
)
