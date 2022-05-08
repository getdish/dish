import { isWeb } from '../constants/constants'
import { getTagSlug } from '../helpers/getTagSlug'
import { InputTagButton } from './InputTagButton'
import { useHomeStore } from './homeStore'
import { focusSearchInput, setAvoidNextAutocompleteShowOnFocus } from './searchInputActions'
import { getTagButtonProps } from './views/TagButton'
import { fullyIdle } from '@dish/async'
import { XStack } from '@dish/ui'
import React, { memo } from 'react'

export const AppSearchInputTagsRow = memo(() => {
  const home = useHomeStore()
  const tags = home.searchBarTags
  // const themeName = useThemeName()
  const focusedTag = home.searchbarFocusedTag
  return (
    <>
      {!!tags.length && (
        // web no margin top, native may want -1
        <XStack marginLeft={10} marginTop={isWeb ? 0 : -1} space={4}>
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
