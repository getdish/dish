import { queryRestaurant } from '../../../queries/queryRestaurant'
import { ensureFlexText } from '../../home/restaurant/ensureFlexText'
import { graphql } from '@dish/graph'
import { ellipseText } from '@dish/helpers'
import {
  FontSizeTokens,
  Input,
  Paragraph,
  XStack,
  YStack,
  getFontSize,
  useDebounce,
  useTheme,
} from '@dish/ui'
import { capitalize } from 'lodash'
import React, { memo } from 'react'

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
    size = '$4',
    disableEllipse,
    maxLines = 3,
  }: {
    isDishBot?: boolean
    restaurantSlug: string
    fullHeight?: boolean
    size?: FontSizeTokens
    text?: string | null
    isEditingDescription?: boolean
    onEditDescription?: (next: string) => void
    onEditCancel?: () => void
    disableEllipse?: boolean
    maxLines?: number
  }) {
    const [restaurant] = queryRestaurant(restaurantSlug)
    const onChangeDescriptionDbc = useDebounce(onEditDescription ?? idFn, 150)
    const fontSize = getFontSize(size)

    if (!restaurant) {
      return null
    }

    const headlines = (restaurant.headlines ?? [])
      .slice(0, 3)
      .map((x) => x?.sentence)
      .join(' ')
    const summary = text || restaurant.summary || headlines || ''

    if (summary || isEditingDescription) {
      const content = (
        // height 100% necessary for native
        <YStack
          width="100%"
          height={fullHeight ? 'auto' : undefined}
          maxHeight={fontSize * 1.5 * maxLines}
        >
          <XStack
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
              <YStack flex={1} overflow="hidden" pointerEvents="auto">
                {ensureFlexText}
                <Input
                  defaultValue={summary}
                  flex={1}
                  height="100%"
                  maxWidth="100%"
                  multiline
                  numberOfLines={5}
                  size={size}
                  color="$color"
                  onChangeText={onChangeDescriptionDbc}
                />
              </YStack>
            ) : (
              <Paragraph
                className="break-word"
                display="flex"
                pointerEvents="auto"
                size={size}
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
              </Paragraph>
            )}
          </XStack>
          {ensureFlexText}
        </YStack>
      )

      if (isDishBot) {
        return content
        // return (
        //   <YStack padding={20}>
        //     <Text>
        //       <Text fontWeight="800">DishBot</Text> summarizes...
        //     </Text>
        //     <Spacer />
        //     {content}
        //   </YStack>
        // )
        // return (
        //   <CommentBubble
        //     avatar={{
        //       charIndex: 0,
        //       image: '',
        //     }}
        //     username=""
        //     text={content}
        //     name="DishBot"
        //     source="dish"
        //   >
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
