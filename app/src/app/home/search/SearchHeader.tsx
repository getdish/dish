import { isWeb } from '../../../constants/constants'
import { tagLenses } from '../../../constants/localTags'
import { getActiveTags } from '../../../helpers/getActiveTags'
import { getTitleForState } from '../../../helpers/getTitleForState'
import { useContentScrollHorizontalFitter } from '../../views/ContentScrollViewHorizontal'
import { ContentScrollViewHorizontalFitted } from '../../views/ContentScrollViewHorizontalFitted'
import { SearchPagePropsContext } from './SearchPagePropsContext'
import { SearchPageScoring } from './SearchPageScoring'
import { H1, H2, H3, Spacer, Text, Theme, XStack, YStack, useMedia } from '@dish/ui'
import React, { Suspense, memo, useContext } from 'react'

export const SearchHeader = memo(() => {
  const { width, setWidthDebounce } = useContentScrollHorizontalFitter()
  const media = useMedia()
  const curProps = useContext(SearchPagePropsContext)!

  const { title, subTitle } = getTitleForState(curProps.item, {
    lowerCase: true,
  })

  const lenseTag = getActiveTags(curProps.item).find((x) => x.type === 'lense') ?? tagLenses[0]
  const lenseColor = lenseTag['color']

  if (!curProps) {
    console.warn('no search props')
    return null
  }

  return (
    <>
      <ContentScrollViewHorizontalFitted width={width} setWidth={setWidthDebounce}>
        <YStack width="100%">
          <YStack pt="$3" />
          <XStack position="relative" zIndex={100}>
            <YStack
              theme={lenseColor}
              py={8}
              px={25}
              $sm={{ px: 25 }}
              position="relative"
              zIndex={100}
              x={-10}
            >
              <H1 className="font-title" size="$9">
                {title.trim()}
              </H1>
              {!!subTitle && <H3 size="$6">in {subTitle.trim()}</H3>}
              {!media.sm && (
                <>
                  <Spacer size="$1" />
                  <SearchPageScoring />
                </>
              )}
            </YStack>
            <XStack marginLeft={-10} marginBottom={8} position="relative">
              {/* <YStack position="relative" alignItems="center" justifyContent="center" x={-10}>
                <SlantedTitle size="xs">Lists</SlantedTitle>
                <AbsoluteYStack right={-14} rotate="90deg">
                  <Arrow />
                </AbsoluteYStack>
              </YStack> */}

              {/* <SearchForkListButton size="sm" /> */}

              {/* <Suspense fallback={null}>
                <SearchPageListsRow />
              </Suspense> */}
            </XStack>
          </XStack>
        </YStack>
      </ContentScrollViewHorizontalFitted>
      <Suspense fallback={null}>
        {/* <SearchPageResultsInfoBox state={curProps.item} /> */}
      </Suspense>
      <Spacer size="$2" />
    </>
  )
})
