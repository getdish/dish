import React, { Suspense, memo, useContext } from 'react'
import { AbsoluteVStack, HStack, Spacer, Text, VStack, useMedia, useTheme } from 'snackui'

import { isWeb } from '../../../constants/constants'
import { tagLenses } from '../../../constants/localTags'
import { getActiveTags } from '../../../helpers/getActiveTags'
import { getTitleForState } from '../../../helpers/getTitleForState'
import { rgbString } from '../../../helpers/rgb'
import { useContentScrollHorizontalFitter } from '../../views/ContentScrollViewHorizontal'
import { ContentScrollViewHorizontalFitted } from '../../views/ContentScrollViewHorizontalFitted'
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

  if (!curProps) {
    console.warn('no search props')
    return null
  }

  const { title, subTitle } = getTitleForState(curProps.item, {
    lowerCase: true,
  })

  const lenseTag = getActiveTags(curProps.item).find((x) => x.type === 'lense') ?? tagLenses[0]
  const lenseColor = lenseTag.rgb
  const theme = useTheme()
  return (
    <>
      <ContentScrollViewHorizontalFitted width={width} setWidth={setWidthDebounce}>
        <VStack width="100%">
          <VStack paddingTop={media.sm ? 12 : 12 + 52 + 10} />
          <HStack position="relative">
            <VStack zIndex={10} x={-10}>
              <VStack paddingLeft={25} paddingRight={25} paddingVertical={12} marginBottom={-3}>
                <VStack paddingTop={isWeb ? 0 : 5} paddingLeft={media.sm ? 0 : 20}>
                  <Text
                    color={theme.color}
                    marginTop={-4}
                    marginBottom={0}
                    height={28}
                    fontWeight="700"
                    fontSize={title.length < 20 ? 30 : 28}
                    lineHeight={28}
                  >
                    {title}
                  </Text>
                  {!!subTitle && (
                    <Text
                      color={rgbString(lenseColor)}
                      opacity={0.8}
                      className="nobreak"
                      fontSize={22}
                      fontWeight="300"
                    >
                      {subTitle}
                    </Text>
                  )}
                </VStack>
              </VStack>
              <Spacer size="xs" />
              <SearchPageScoring />
            </VStack>
            <HStack marginLeft={-30} marginBottom={8} position="relative">
              <VStack position="relative" alignItems="center" justifyContent="center" x={-10}>
                <SlantedTitle size="xs">Lists</SlantedTitle>
                <AbsoluteVStack right={-14} rotate="90deg">
                  <Arrow />
                </AbsoluteVStack>
              </VStack>

              {/* <SearchForkListButton size="sm" /> */}

              <Suspense fallback={null}>
                <SearchPageListsRow />
              </Suspense>
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
