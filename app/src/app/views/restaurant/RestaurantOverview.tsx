import { graphql } from '@dish/graph'
import { ellipseText } from '@dish/helpers'
import { capitalize } from 'lodash'
import React, { memo, useRef } from 'react'
import { AbsoluteVStack, HStack, Input, Spacer, Text, VStack, useDebounce, useTheme } from 'snackui'

import { blue } from '../../../constants/colors'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { ensureFlexText } from '../../home/restaurant/ensureFlexText'
import { SmallButton } from '../SmallButton'

const quote = (
  <AbsoluteVStack top={-10} left={-0}>
    <Text color="#000" fontSize={60} opacity={0.1}>
      &ldquo;
    </Text>
  </AbsoluteVStack>
)

const idFn = (_) => _

export const RestaurantOverview = memo(
  graphql(function RestaurantOverview({
    text,
    isDishBot,
    isEditingDescription,
    onEditDescription,
    onEditCancel,
    restaurantSlug,
    fullHeight,
    size = 'md',
    disableEllipse,
    maxLines = 3,
  }: {
    isDishBot?: boolean
    restaurantSlug: string
    fullHeight?: boolean
    size?: 'lg' | 'md'
    text?: string | null
    isEditingDescription?: boolean
    onEditDescription?: (next: string) => void
    onEditCancel?: () => void
    disableEllipse?: boolean
    maxLines?: number
  }) {
    const theme = useTheme()
    const [restaurant] = queryRestaurant(restaurantSlug)
    const onChangeDescriptionDbc = useDebounce(onEditDescription ?? idFn, 150)

    if (!restaurant) {
      return null
    }

    const headlines = (restaurant.headlines ?? [])
      .slice(0, 3)
      .map((x) => x?.sentence)
      .join(' ')
    const summary = text || restaurant.summary || headlines || 'No overview :('
    const scale = size === 'lg' ? 1.1 : 1
    const extra = size === 'lg' ? 2 : 1
    const lineHeight = Math.round((size === 'lg' ? 26 : 24) * scale + extra * scale)
    const fontSize = Math.round(14 * scale + extra)

    if (summary || isEditingDescription) {
      const content = (
        // height 100% necessary for native
        <VStack
          width="100%"
          marginVertical={lineHeight * 0.5}
          height={fullHeight ? '100%' : undefined}
          maxHeight={lineHeight * maxLines}
        >
          {ensureFlexText}
          <HStack
            maxWidth="100%"
            width="100%"
            overflow="hidden"
            paddingHorizontal={25}
            marginHorizontal={-30}
            flex={1}
            alignSelf="center"
            position="relative"
          >
            {/* {quote} */}
            {isEditingDescription ? (
              <VStack flex={1} overflow="hidden" pointerEvents="auto">
                {ensureFlexText}
                <Input
                  defaultValue={summary}
                  flex={1}
                  height="100%"
                  maxWidth="100%"
                  multiline
                  numberOfLines={5}
                  fontSize={fontSize}
                  lineHeight={lineHeight}
                  color={theme.color}
                  onChangeText={onChangeDescriptionDbc}
                />
              </VStack>
            ) : (
              <Text
                className="break-word"
                display="flex"
                marginTop="auto"
                marginBottom="auto"
                fontSize={fontSize}
                lineHeight={lineHeight}
                selectable
                // short descriptions look bad in minHieght
                // minHeight={lineHeight * 2}
                // fontWeight="500"
                color={size === 'lg' ? theme.color : theme.colorSecondary}
                pointerEvents="auto"
              >
                {disableEllipse
                  ? summary
                  : ellipseText(
                      summary
                        .replace(/(\s{2,}|\n)/g, ' ')
                        .split('. ')
                        .map((sentence) => capitalize(sentence.trim()))
                        .join('. '),
                      {
                        maxLength: 380,
                      }
                    )}
              </Text>
            )}
          </HStack>
        </VStack>
      )

      if (isDishBot) {
        return content
        // return (
        //   <VStack padding={20}>
        //     <Text>
        //       <Text fontWeight="800">DishBot</Text> summarizes...
        //     </Text>
        //     <Spacer />
        //     {content}
        //   </VStack>
        // )
        // return (
        //   <CommentBubble name="" avatar={<VStack />} avatarBackgroundColor="transparent">
        //     {content}
        //   </CommentBubble>
        // )
      }

      return content
    } else {
      // console.log('no summary', summary)
    }

    return null
  })
)
