import { Tag } from '@dish/graph'
import { VStack } from '@dish/ui'
import React, { memo } from 'react'

import { getTagId } from '../../state/getTagId'
import { HomeActiveTagIds } from '../../state/home'
import { useOvermind } from '../../state/useOvermind'
import { LenseButton, LenseButtonSize } from './LenseButton'

export const HomeLenseBar = memo(
  (props: {
    activeTagIds?: HomeActiveTagIds
    size?: LenseButtonSize
    minimal?: boolean
    backgroundColor?: string
    onPressLense?: (lense: Tag) => void
  }) => {
    const om = useOvermind()
    return (
      <>
        {om.state.home.allLenseTags.map((lense, index) => (
          <VStack marginHorizontal={4} key={lense.id + index}>
            <LenseButton
              lense={lense}
              isActive={props.activeTagIds?.[getTagId(lense)] ?? false}
              minimal={props.minimal}
              size={props.size}
              backgroundColor={props.backgroundColor}
              {...(props.onPressLense && {
                onPress: (e) => {
                  e.stopPropagation()
                  props.onPressLense?.(lense)
                },
              })}
            />
          </VStack>
        ))}
      </>
    )
  }
)
