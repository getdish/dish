import { ArrowUp, ChevronLeft } from '@dish/react-feather'
import { useStoreInstance } from '@dish/use-store'
import React, { memo } from 'react'
import { VStack, useTheme } from 'snackui'

import { isWeb, searchBarHeight } from '../constants/constants'
import { autocompletesStore } from './AutocompletesStore'
import { homeStore, useHomeStoreSelector } from './homeStore'
import { Link } from './views/Link'

export const SearchBarActionButton = memo(() => {
  const upRoute = useHomeStoreSelector((x) => x.upRoute)
  const isOnHome = useHomeStoreSelector((x) => x.currentStateType === 'home')
  const autocompletes = useStoreInstance(autocompletesStore)
  const showAutocomplete = autocompletes.visible
  const isDisabled = !showAutocomplete && isOnHome
  const Icon = (() => {
    if (showAutocomplete) {
      // if (media.sm) {
      //   return ArrowDown
      // }
      return ArrowUp
    }
    return ChevronLeft
  })()

  return (
    <Link
      marginRight={-5}
      opacity={isWeb && !showAutocomplete ? 0 : 1}
      onPress={() => {
        if (showAutocomplete) {
          autocompletes.setVisible(false)
        } else {
          homeStore.popBack()
        }
      }}
      {...(!showAutocomplete && upRoute)}
    >
      <VStack
        alignSelf="center"
        skewX="-12deg"
        pointerEvents={isDisabled ? 'none' : 'auto'}
        width={30}
        height={searchBarHeight}
        alignItems="center"
        justifyContent="center"
        opacity={0}
        padding={0}
        backgroundColor="rgba(0,0,0,0.1)"
        {...(!isDisabled && {
          opacity: 0.5,
          hoverStyle: {
            opacity: 1,
          },
          pressStyle: {
            opacity: 0.2,
          },
        })}
      >
        <VStack skewX="12deg">
          <Icon color="#fff" size={20} />
        </VStack>
      </VStack>
    </Link>
  )
})
