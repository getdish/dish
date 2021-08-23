import { fullyIdle } from '@dish/async'
import React, { memo } from 'react'
import { Button, ButtonProps, HStack, Theme, useTheme, useThemeName } from 'snackui'

import { isWeb } from '../constants/constants'
import { getTagSlug } from '../helpers/getTagSlug'
import { focusSearchInput, setAvoidNextAutocompleteShowOnFocus } from './AppSearchInput'
import { useHomeStore } from './homeStore'
import { TagButton, TagButtonProps, getTagButtonProps } from './views/TagButton'

export const AppSearchInputTagsRow = memo(({ input }: { input: HTMLInputElement | null }) => {
  const home = useHomeStore()
  const tags = home.searchBarTags
  // const themeName = useThemeName()
  const focusedTag = home.searchbarFocusedTag
  return (
    <>
      {!!tags.length && (
        // web no margin top, native may want -1
        <HStack marginLeft={10} marginTop={isWeb ? 0 : -1} spacing={4}>
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
        </HStack>
      )}
    </>
  )
})

// TODO these two are manually in sync, this...

export const InputTagButton = (props: TagButtonProps & { isActive?: boolean }) => {
  const theme = useTheme()
  return (
    <TagButton
      theme="light"
      size="lg"
      closable
      subtleIcon
      color="#111"
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
      {...(props.isActive && {
        backgroundColor: theme.backgroundColor,
        hoverStyle: {
          backgroundColor: theme.backgroundColor,
        },
      })}
      {...props}
    />
  )
}
