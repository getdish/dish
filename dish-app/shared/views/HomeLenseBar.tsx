import { Tag } from '@dish/graph'
import React, { memo } from 'react'
import { VStack } from 'snackui'

import { getTagId } from '../state/getTagId'
import { HomeActiveTagsRecord } from '../state/home-types'
import { tagLenses } from '../state/tagLenses'
import { LenseButton, LenseButtonSize } from './LenseButton'

export const HomeLenseBar = memo(
  (props: {
    activeTagIds?: HomeActiveTagsRecord
    size?: LenseButtonSize
    minimal?: boolean
    backgroundColor?: string
    onPressLense?: (lense: Tag) => void
  }) => {
    return (
      <>
        {tagLenses.map((lense, index) => {
          const isActive = props.activeTagIds?.[getTagId(lense)] ?? false
          return (
            <VStack
              zIndex={isActive ? 1 : 0}
              height="100%"
              key={lense.id + index}
            >
              <LenseButton
                lense={lense}
                isActive={isActive}
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
          )
        })}
      </>
    )
  }
)
