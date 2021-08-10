import { graphql } from '@dish/graph'
import { ellipseText } from '@dish/helpers'
import { capitalize } from 'lodash'
import React, { memo, useRef, useState } from 'react'
import { AbsoluteVStack, HStack, Input, Spacer, Text, VStack, useTheme } from 'snackui'

import { blue } from '../../../constants/colors'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { ensureFlexText } from '../../home/restaurant/ensureFlexText'
import { CommentBubble } from '../CommentBubble'
import { Link } from '../Link'
import { LogoCircle } from '../Logo'
import { SmallButton } from '../SmallButton'

const quote = (
  <AbsoluteVStack top={-10} left={-0}>
    <Text color="#000" fontSize={60} opacity={0.1}>
      &ldquo;
    </Text>
  </AbsoluteVStack>
)

export const RestaurantOverview = memo(
  graphql(function RestaurantOverview({
    text,
    isDishBot,
    editableDescription,
    onEdit,
    restaurantSlug,
    fullHeight,
    size,
    disableEllipse,
    maxLines = 3,
  }: {
    isDishBot?: boolean
    restaurantSlug: string
    fullHeight?: boolean
    size?: 'lg'
    text?: string | null
    editableDescription?: boolean
    onEdit?: (next: string) => void
    disableEllipse?: boolean
    maxLines?: number
  }) {
    const theme = useTheme()
    const [restaurant] = queryRestaurant(restaurantSlug)

    if (!restaurant) {
      return null
    }

    const headlines = (restaurant.headlines ?? [])
      .slice(0, 3)
      .map((x) => x?.sentence)
      .join(' ')
    const summary = text || restaurant.summary || headlines || 'No overview :('
    const scale = 1
    const extra = size === 'lg' ? 1.1 : 1
    const lineHeight = Math.round((size === 'lg' ? 26 : 24) * scale + extra * scale)
    const fontSize = Math.round(15 * scale + extra)
    const [isEditing, setIsEditing] = useState(false)
    const editedText = useRef('')

    if (summary || editableDescription) {
      const content = (
        // height 100% necessary for native
        <VStack
          width="100%"
          height={fullHeight ? '100%' : undefined}
          maxHeight={lineHeight * maxLines - 2}
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
            {isEditing ? (
              <VStack>
                {ensureFlexText}
                <Input
                  defaultValue={summary}
                  flex={1}
                  height="100%"
                  width="100%"
                  multiline
                  numberOfLines={5}
                  fontSize={fontSize}
                  lineHeight={lineHeight}
                  color={theme.color}
                  onChangeText={(text) => {
                    editedText.current = text
                  }}
                />
                <HStack marginVertical={10} alignItems="center" justifyContent="center" flex={1}>
                  <VStack flex={1} />
                  <Text
                    color={blue}
                    onPress={() => {
                      setIsEditing(false)
                    }}
                  >
                    Cancel
                  </Text>
                  <Spacer size="sm" />
                  <SmallButton
                    onPress={() => {
                      onEdit?.(editedText.current)
                      setIsEditing(false)
                    }}
                  >
                    Save
                  </SmallButton>
                </HStack>
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
                color={theme.colorTertiary}
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

                {editableDescription && !isEditing && (
                  <Link
                    zIndex={1000001}
                    onPress={() => {
                      setIsEditing(true)
                    }}
                  >
                    Edit
                  </Link>
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
