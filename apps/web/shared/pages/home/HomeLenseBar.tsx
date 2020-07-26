import { Tag } from '@dish/graph'
import { Spacer } from '@dish/ui'
import React, { memo } from 'react'

import { HomeActiveTagIds } from '../../state/home'
import { getTagId } from '../../state/Tag'
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
          <React.Fragment key={lense.id + index}>
            <LenseButton
              lense={lense}
              isActive={props.activeTagIds?.[getTagId(lense)] ?? false}
              minimal={props.minimal}
              size={props.size}
              backgroundColor={props.backgroundColor}
              {...(props.onPressLense && {
                onPress: (e) => {
                  e.stopPropagation()
                  props.onPressLense(lense)
                },
              })}
            />
            {index < om.state.home.allLenseTags.length - 1 && (
              <Spacer size={2} />
            )}
          </React.Fragment>
        ))}
      </>
    )
  }
)
