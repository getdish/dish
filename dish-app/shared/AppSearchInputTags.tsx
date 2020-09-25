import { fullyIdle } from '@dish/async'
import { HStack } from '@dish/ui'
import React, { memo } from 'react'

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

    return (
      <>
        {!!om.state.home.searchBarTags.length && (
          <HStack marginLeft={10} marginTop={-1} spacing={4}>
            {om.state.home.searchBarTags.map((tag) => {
              const isActive = om.state.home.searchbarFocusedTag === tag
              return (
                <TagButton
                  className="no-transition"
                  key={getTagId(tag)}
                  subtleIcon
                  backgroundColor="rgba(0,0,0,0.3)"
                  color={'#fff'}
                  shadowColor="#00000022"
                  fontWeight="500"
                  shadowRadius={10}
                  shadowOffset={{ height: 2, width: 0 }}
                  borderColor={'transparent'}
                  hoverStyle={{
                    backgroundColor: 'rgba(0,0,0,0.4)',
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
