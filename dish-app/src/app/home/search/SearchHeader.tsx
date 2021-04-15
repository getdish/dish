import React, { Suspense, memo, useContext } from 'react'
import { AbsoluteVStack, HStack, Text, VStack, useMedia } from 'snackui'

import { tagLenses } from '../../../constants/localTags'
import { getActiveTags } from '../../../helpers/getActiveTags'
import { getTitleForState } from '../../../helpers/getTitleForState'
import { rgbString } from '../../../helpers/rgbString'
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
  const lenseTag = getActiveTags(curProps.item).find((x) => x.type === 'lense') ?? tagLenses[0]
  const lenseColor = lenseTag.rgb
  return (
    <>
      <ContentScrollViewHorizontalFitted width={width} setWidth={setWidthDebounce}>
        <VStack width="100%">
          <VStack paddingTop={media.sm ? 12 : 12 + 52 + 10} />
          <HStack position="relative">
            <VStack zIndex={0} transform={[{ translateX: -10 }]}>
              <AbsoluteVStack zIndex={10000} top={-9} left={15}>
                <SearchForkListButton size="sm" />
              </AbsoluteVStack>
              <SlantedTitle
                paddingLeft={55}
                paddingHorizontal={20}
                backgroundColor={rgbString(lenseColor)}
              >
                <VStack alignItems="center">
                  <Text fontWeight="800" color="#fff" fontSize={20} lineHeight={28}>
                    {title}
                  </Text>
                  <Text color="#fff" className="nobreak" fontSize={16} fontWeight="300">
                    {subTitle}
                  </Text>
                </VStack>
              </SlantedTitle>
              <SearchPageScoring />
            </VStack>
            <HStack marginLeft={-50} marginBottom={8} position="relative">
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
