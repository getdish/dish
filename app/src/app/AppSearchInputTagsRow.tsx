import { fullyIdle } from '@dish/async'
import React, { memo } from 'react'
import { HStack, useTheme, useThemeName } from 'snackui'

import { isWeb } from '../constants/constants'
import { getTagSlug } from '../helpers/getTagSlug'
import { focusSearchInput, setAvoidNextAutocompleteShowOnFocus } from './AppSearchInput'
import { useHomeStore } from './homeStore'
import { TagButton, getTagButtonProps } from './views/TagButton'

export const AppSearchInputTagsRow = memo(({ input }: { input: HTMLInputElement | null }) => {
  const home = useHomeStore()
  const tags = home.searchBarTags
  // const themeName = useThemeName()
  const focusedTag = home.searchbarFocusedTag
  const theme = useTheme()

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
                theme="light"
                size="lg"
                subtleIcon
                // shadowColor="#00000022"
                // color="#000"
                // fontWeight="600"
                backgroundColor="#fff"
                hoverStyle={{
                  backgroundColor: '#ffffffee',
                }}
                pressStyle={{
                  backgroundColor: '#ffffff99',
                }}
                // shadowRadius={8}
                elevation={1}
                hideRating
                hideRank
                {...(isActive && {
                  backgroundColor: theme.backgroundColor,
                  hoverStyle: {
                    backgroundColor: theme.backgroundColor,
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
