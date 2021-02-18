import React, { Suspense, memo, useContext } from 'react'
import { AbsoluteVStack, HStack, Spacer, Text, VStack, useMedia } from 'snackui'

import { getTitleForState } from '../../../helpers/getTitleForState'
import { rgbString } from '../../../helpers/rgbString'
import { useCurrentLenseColor } from '../../hooks/useCurrentLenseColor'
import {
  ContentScrollViewHorizontalFitted,
  useContentScrollHorizontalFitter,
} from '../../views/ContentScrollViewHorizontal'
import { SlantedTitle } from '../../views/SlantedTitle'
import { Arrow } from './Arrow'
import { SearchForkListButton } from './SearchForkListButton'
import { SearchPageListsRow } from './SearchPageListsRow'
import { SearchPagePropsContext } from './SearchPagePropsContext'
import { SearchPageResultsInfoBox } from './SearchPageResultsInfoBox'
import { SearchPageScoring } from './SearchPageScoring'

export const SearchHeader = memo(() => {
  const { width, setWidthDebounce } = useContentScrollHorizontalFitter()
  const media = useMedia()
  const curProps = useContext(SearchPagePropsContext)!
  const { title, subTitle } = getTitleForState(curProps.item, {
    lowerCase: true,
  })
  const lenseColor = useCurrentLenseColor()
  return (
    <>
      <ContentScrollViewHorizontalFitted
        width={width}
        setWidth={setWidthDebounce}
      >
        <VStack width="100%">
          <VStack paddingTop={media.sm ? 12 : 12 + 52 + 10} />
          <HStack>
            <AbsoluteVStack zIndex={1000} top={5} left={5}>
              <SearchForkListButton />
            </AbsoluteVStack>
            <VStack>
              <SlantedTitle
                paddingHorizontal={20}
                backgroundColor={rgbString(lenseColor)}
                color="#fff"
                size="xl"
                fontWeight="800"
                minWidth={200}
                borderRadius={8}
              >
                <VStack alignItems="center">
                  <Text>{title}</Text>
                  <Spacer size="xl" />
                  <Text
                    position="absolute"
                    bottom={0}
                    fontSize={16}
                    fontWeight="300"
                  >
                    {subTitle}
                  </Text>
                </VStack>
              </SlantedTitle>
              <SearchPageScoring />
            </VStack>
            <HStack marginBottom={8} position="relative">
              <VStack
                position="relative"
                alignItems="center"
                justifyContent="center"
                transform={[{ translateX: -10 }]}
              >
                <SlantedTitle size="xs">Lists</SlantedTitle>
                <AbsoluteVStack right={-14} transform={[{ rotate: '90deg' }]}>
                  <Arrow />
                </AbsoluteVStack>
              </VStack>

              <SearchPageListsRow />
            </HStack>
          </HStack>
        </VStack>
      </ContentScrollViewHorizontalFitted>
      <Suspense fallback={null}>
        <SearchPageResultsInfoBox state={curProps.item} />
      </Suspense>
    </>
  )
})
