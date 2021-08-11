import React, { memo, useEffect, useState } from 'react'
import { VStack, useDebounce } from 'snackui'

import { tagLenses } from '../../constants/localTags'
import { HomeActiveTagsRecord } from '../../types/homeTypes'
import { LenseButton, LenseButtonSize } from './LenseButton'

export const HomeLenseBar = memo(
  (props: {
    activeTags?: HomeActiveTagsRecord
    size?: LenseButtonSize
    minimal?: boolean
    backgroundColor?: string
  }) => {
    const [active, setActive] = useState<HomeActiveTagsRecord>({})

    useEffect(() => {
      setActive(props.activeTags || {})
    }, [props.activeTags])

    return (
      <>
        {tagLenses.map((lense, index) => {
          const isActive = active[lense.slug] || false
          return (
            <VStack
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
                  setActive({
                    [lense.slug]: true,
                  })
                }}
              />
            </VStack>
          )
        })}
      </>
    )
  }
)
