import React, { memo } from 'react'
import { VStack } from 'snackui'

import { tagLenses } from '../../constants/localTags'
import { HomeActiveTagsRecord } from '../../types/homeTypes'
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
          const isActive = props.activeTags?.[lense.slug] ?? false
          return (
            <VStack
              height="100%"
              zIndex={isActive ? 1 : 0}
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
