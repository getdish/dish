import { Tag } from '@dish/graph'
import React, { memo } from 'react'
import { VStack } from 'snackui'

import { getTagSlug } from '../state/getTagSlug'
import { HomeActiveTagsRecord } from '../state/home-types'
import { tagLenses } from '../state/localTags'
import { LenseButton, LenseButtonSize } from './LenseButton'

export const HomeLenseBar = memo(
  (props: {
    activeTags?: HomeActiveTagsRecord
    size?: LenseButtonSize
    minimal?: boolean
    backgroundColor?: string
    onPressLense?: (lense: typeof tagLenses[number]) => void
  }) => {
    return (
      <>
        {tagLenses.map((lense, index) => {
          const isActive = props.activeTags?.[getTagSlug(lense)] ?? false
          return (
            <VStack
              zIndex={isActive ? 1 : 0}
              height="100%"
              key={lense.id + index}
              justifyContent="center"
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
