import { fullyIdle } from '@o/async'
import React, { memo } from 'react'
import { HStack } from 'snackui'

import {
  focusSearchInput,
  setAvoidNextAutocompleteShowOnFocus,
} from './AppSearchInput'
import { isWeb } from './constants'
import { getTagId } from './state/getTagId'
import { useOvermind } from './state/om'
import { TagButton } from './views/TagButton'

export const AppSearchInputTags = memo(
  ({ input }: { input: HTMLInputElement | null }) => {
    const om = useOvermind()
    const tags = om.state.home.searchBarTags
    const focusedTag = om.state.home.searchbarFocusedTag

    return (
      <>
        {!!tags.length && (
          <HStack marginLeft={10} marginTop={-1} spacing={4}>
            {tags.map((tag) => {
              const isActive = focusedTag === tag
              return (
                <TagButton
                  className="no-transition"
                  key={getTagId(tag)}
                  subtleIcon
                  backgroundColor="rgba(0,0,0,0.25)"
                  color={'#fff'}
                  shadowColor="#00000022"
                  fontWeight="600"
                  shadowRadius={10}
                  shadowOffset={{ height: 2, width: 0 }}
                  borderColor={'transparent'}
                  hoverStyle={{
                    backgroundColor: 'rgba(0,0,0,0.3)',
                  }}
                  {...(isActive && {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    hoverStyle: {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  })}
                  {...(!isWeb && {
                    transform: [{ translateY: 2 }],
                  })}
                  size="lg"
                  // @ts-ignore
                  name={tag.name}
                  // @ts-ignore
                  type={tag.type}
                  icon={tag.icon ?? ''}
                  rgb={tag.rgb}
                  onPress={() => {
                    om.actions.home.setSearchBarFocusedTag(tag)
                  }}
                  closable
                  onClose={async () => {
                    om.actions.home.navigate({ tags: [tag] })
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
  }
)
