import { YStack } from '@dish/ui'
import React, { memo, useLayoutEffect, useState } from 'react'

import { tagLenses } from '../../constants/localTags'
import { HomeActiveTagsRecord } from '../../types/homeTypes'
import { resetResults } from '../home/search/SearchPageStore'
import { LenseButton, LenseButtonSize } from './LenseButton'

export const LenseButtonBar = memo(
  (props: {
    activeTags?: HomeActiveTagsRecord
    size?: LenseButtonSize
    minimal?: boolean
    backgroundColor?: string
  }) => {
    const [active, setActive] = useState<HomeActiveTagsRecord>({})

    useLayoutEffect(() => {
      setActive(props.activeTags || {})
    }, [props.activeTags])

    return (
      <>
        {tagLenses.map((lense, index) => {
          const isActive = active[lense.slug] || false
          return (
            <YStack
              height="100%"
              zIndex={isActive ? 1 : 0}
              marginRight={4}
              key={lense.id + index}
              justifyContent="center"
            >
              <LenseButton
                lense={lense}
                isActive={isActive}
                minimal={props.minimal}
                size={props.size}
                backgroundColor={props.backgroundColor}
                onPress={(e) => {
                  e.stopPropagation()
                  resetResults()
                  setActive({
                    [lense.slug]: true,
                  })
                }}
              />
            </YStack>
          )
        })}
      </>
    )
  }
)
