import { Tag } from '@dish/graph'
import { VStack } from '@dish/ui'
import React, { memo } from 'react'

import { getTagId } from '../../state/getTagId'
import { HomeActiveTagsRecord } from '../../state/home-types'
import { useOvermind } from '../../state/om'
import { LenseButton, LenseButtonSize } from './LenseButton'

export const HomeLenseBar = memo(
  (props: {
    activeTagIds?: HomeActiveTagsRecord
    size?: LenseButtonSize
    minimal?: boolean
    backgroundColor?: string
    onPressLense?: (lense: Tag) => void
  }) => {
    const om = useOvermind()
    return (
      <>
        {om.state.home.allLenseTags.map((lense, index) => (
          <VStack
            minWidth={42}
            height="100%"
            marginHorizontal={0}
            key={lense.id + index}
          >
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
