import { fullyIdle } from '@dish/async'
import { XStack } from '@dish/ui'
import React, { memo } from 'react'

import { isWeb } from '../constants/constants'
import { getTagSlug } from '../helpers/getTagSlug'
import { focusSearchInput, setAvoidNextAutocompleteShowOnFocus } from './AppSearchInput'
import { useHomeStore } from './homeStore'
import { InputTagButton } from './InputTagButton'
import { getTagButtonProps } from './views/TagButton'

export const AppSearchInputTagsRow = memo(() => {
  const home = useHomeStore()
  const tags = home.searchBarTags
  // const themeName = useThemeName()
  const focusedTag = home.searchbarFocusedTag
  return (
    <>
      {!!tags.length && (
        // web no margin top, native may want -1
        <XStack marginLeft={10} marginTop={isWeb ? 0 : -1} spacing={4}>
          {tags.map((tag) => {
            const isActive = focusedTag === tag
            return (
              <InputTagButton
                key={getTagSlug(tag.slug)}
                isActive={isActive}
                {...getTagButtonProps(tag)}
                onPressOut={() => {
                  home.setSearchBarFocusedTag(tag)
                }}
                onClose={async () => {
                  home.navigate({ tags: [tag] })
                  await fullyIdle()
                  setAvoidNextAutocompleteShowOnFocus()
                  focusSearchInput()
                }}
              />
            )
          })}
        </XStack>
      )}
    </>
  )
})
