import { useStore } from '@dish/use-store'
import React, { memo } from 'react'
import { Spacer, Theme, VStack, useMedia } from 'snackui'

import { isWeb } from '../constants/constants'
import { AutocompleteItem } from '../helpers/createAutocomplete'
import { AutocompleteItemView } from './AutocompleteItemView'
import { AutocompleteStore, AutocompleteTarget } from './AutocompletesStore'
import { usePageFinishedLoading } from './usePageFinishedLoading'

export const AutocompleteResults = memo(
  ({
    target,
    prefixResults = [],
    onSelect,
  }: {
    target: AutocompleteTarget
    prefixResults?: any[]
    onSelect: AutocompleteSelectCb
    emptyResults?: AutocompleteItem[]
  }) => {
    const autocompleteStore = useStore(AutocompleteStore, { target })
    const activeIndex = autocompleteStore.index
    const ogResults = autocompleteStore.results
    const results = [...prefixResults, ...ogResults]
    const loaded = usePageFinishedLoading()
    const media = useMedia()

    if (!loaded) {
      return null
    }

    return (
      <>
        {results.map((result, index) => {
          const isActive = !isWeb ? index === 0 : activeIndex === index
          return (
            <React.Fragment key={`${result.id}${index}`}>
              <Theme name={isActive ? 'active' : 'dark'}>
                <AutocompleteItemView
                  target={target}
                  index={index}
                  result={result}
                  onSelect={onSelect}
                  isActive={isActive}
                />
              </Theme>
              <Spacer size={1} />
            </React.Fragment>
          )
        })}

        {/* on small screens add */}
        <VStack height={media.pointerCoarse ? 300 : 0} />
      </>
    )
  }
)

export type AutocompleteSelectCb = (result: AutocompleteItem, index: number) => void
