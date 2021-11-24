import { AbsoluteYStack, Spacer, Text, XStack, YStack, useMedia, useTheme } from '@dish/ui'
import React, { Suspense, memo, useContext } from 'react'

import { isNative, isWeb } from '../../../constants/constants'
import { tagLenses } from '../../../constants/localTags'
import { getActiveTags } from '../../../helpers/getActiveTags'
import { getTitleForState } from '../../../helpers/getTitleForState'
import { rgbString } from '../../../helpers/rgb'
import { useContentScrollHorizontalFitter } from '../../views/ContentScrollViewHorizontal'
import { ContentScrollViewHorizontalFitted } from '../../views/ContentScrollViewHorizontalFitted'
import { SlantedTitle } from '../../views/SlantedTitle'
import { Arrow } from './Arrow'
import { SearchPageListsRow } from './SearchPageListsRow'
import { SearchPagePropsContext } from './SearchPagePropsContext'
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
  const theme = useTheme()

  if (!curProps) {
    console.warn('no search props')
    return null
  }

  return (
    <>
      <ContentScrollViewHorizontalFitted width={width} setWidth={setWidthDebounce}>
        <YStack width="100%">
          <YStack paddingTop={media.sm ? 12 : 12 + 52 + 10} />
          <XStack position="relative" zIndex={100}>
            <YStack position="relative" zIndex={100} x={-10}>
              <YStack paddingHorizontal={16} paddingVertical={8} marginBottom={-3}>
                <YStack paddingTop={isWeb ? 0 : 5} paddingLeft={media.sm ? 15 : 20}>
                  <Text
                    className="font-title"
                    fontFamily="$title"
                    color={theme.color}
                    marginTop={-4}
                    marginBottom={0}
                    fontWeight="700"
                    fontSize={title.length < 20 ? 40 : 34}
                    {...(media.sm && {
                      fontSize: title.length < 20 ? 36 : 30,
                    })}
                    height={28}
                    lineHeight={28}
                    {...(isNative && {
                      height: 38,
                      lineHeight: 38,
                    })}
                  >
                    {title.trim()}
                    {!!subTitle && (
                      <Text
                        color={rgbString(lenseColor)}
                        opacity={0.8}
                        className="nobreak"
                        fontSize={title.length < 25 ? 24 : 20}
                        fontWeight="300"
                      >
                        &nbsp; in {subTitle.trim()}
                      </Text>
                    )}
                  </Text>
                </YStack>
              </YStack>
              <Spacer size="xs" />
              <SearchPageScoring />
            </YStack>
            <XStack marginLeft={-10} marginBottom={8} position="relative">
              <YStack position="relative" alignItems="center" justifyContent="center" x={-10}>
                <SlantedTitle size="xs">Lists</SlantedTitle>
                <AbsoluteYStack right={-14} rotate="90deg">
                  <Arrow />
                </AbsoluteYStack>
              </YStack>

              {/* <SearchForkListButton size="sm" /> */}

              <Suspense fallback={null}>
                <SearchPageListsRow />
              </Suspense>
            </XStack>
          </XStack>
        </YStack>
      </ContentScrollViewHorizontalFitted>
      <Suspense fallback={null}>
        {/* <SearchPageResultsInfoBox state={curProps.item} /> */}
      </Suspense>
      <Spacer size="sm" />
    </>
  )
})
