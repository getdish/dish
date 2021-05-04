import { fullyIdle } from '@dish/async'
import React, { memo } from 'react'
import { HStack, useThemeName } from 'snackui'

import { isWeb } from '../constants/constants'
import { getTagSlug } from '../helpers/getTagSlug'
import { focusSearchInput, setAvoidNextAutocompleteShowOnFocus } from './AppSearchInput'
import { useHomeStore } from './homeStore'
import { TagButton, getTagButtonProps } from './views/TagButton'

export const AppSearchInputTagsRow = memo(({ input }: { input: HTMLInputElement | null }) => {
  const home = useHomeStore()
  const tags = home.searchBarTags
  const themeName = useThemeName()
  const focusedTag = home.searchbarFocusedTag

  return (
    <>
      {!!tags.length && (
        // web no margin top, native may want -1
        <HStack marginLeft={10} marginTop={isWeb ? 0 : -1} spacing={4}>
          {tags.map((tag) => {
            const isActive = focusedTag === tag
            return (
              <TagButton
                key={getTagSlug(tag.slug)}
                theme={themeName}
                size="lg"
                subtleIcon
                shadowColor="#00000022"
                color="#fff"
                fontWeight="600"
                backgroundColor="rgba(0,0,0,0.25)"
                height={38}
                shadowRadius={8}
                hideRating
                hideRank
                hoverStyle={{
                  backgroundColor: 'rgba(150,150,150,0.7)',
                }}
                {...(isActive && {
                  backgroundColor: 'rgba(150,150,150,0.1)',
                  hoverStyle: {
                    backgroundColor: 'rgba(150,150,150,0.1)',
                  },
                })}
                {...getTagButtonProps(tag)}
                onPressOut={() => {
                  home.setSearchBarFocusedTag(tag)
                }}
                closable
                onClose={async () => {
                  home.navigate({ tags: [tag] })
                  await fullyIdle()
                  setAvoidNextAutocompleteShowOnFocus()
                  focusSearchInput()
                }}
              />
            )
          })}
        </HStack>
      )}
    </>
  )
})
