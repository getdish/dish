import { graphql } from '@dish/graph'
import { ellipseText } from '@dish/helpers'
import { capitalize } from 'lodash'
import React, { memo, useRef, useState } from 'react'
import {
  AbsoluteVStack,
  Button,
  HStack,
  Input,
  Spacer,
  Text,
  VStack,
  useTheme,
} from 'snackui'

import { blue } from '../../../constants/colors'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { ensureFlexText } from '../../home/restaurant/ensureFlexText'
import { SmallButton } from '../SmallButton'

const quote = (
  <AbsoluteVStack top={-10} left={-0}>
    <Text fontSize={60} opacity={0.058}>
      &ldquo;
    </Text>
  </AbsoluteVStack>
)

export const RestaurantOverview = memo(
  graphql(function RestaurantOverview({
    text,
    editableDescription,
    onEdit,
    restaurantSlug,
    fullHeight,
    size,
    disableEllipse,
    maxLines = 3,
  }: {
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
    const headlines = (restaurant.headlines() ?? [])
      .slice(0, 3)
      .map((x) => x.sentence)
      .join(' ')
    const summary = text ?? restaurant.summary ?? headlines
    const scale = 2.1 - Math.max(1.0, Math.min(1.1, summary.length / 250))
    const extra = size === 'lg' ? 3 : 0
    const lineHeight = Math.round((size === 'lg' ? 26 : 24) * scale + extra)
    const fontSize = Math.round(16 * scale + extra)
    const [isEditing, setIsEditing] = useState(false)
    const editedText = useRef('')

    if (summary || editableDescription) {
      return (
        <VStack>
          <HStack
            maxHeight={fullHeight ? 'auto' : lineHeight * maxLines - 2}
            overflow="hidden"
            paddingHorizontal={30}
            marginHorizontal={-30}
            flex={1}
            alignSelf="center"
            position="relative"
          >
            {quote}
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
                <HStack
                  marginVertical={10}
                  alignItems="center"
                  justifyContent="center"
                  flex={1}
                >
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
                display="flex"
                marginTop="auto"
                marginBottom="auto"
                fontSize={fontSize}
                lineHeight={lineHeight}
                opacity={1}
                // fontWeight="500"
                color={theme.colorSecondary}
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
                {ensureFlexText}
              </Text>
            )}
          </HStack>
          {editableDescription && (
            <SmallButton
              marginLeft={5}
              onPress={() => {
                setIsEditing(true)
              }}
            >
              Edit description &raquo;
            </SmallButton>
          )}
        </VStack>
      )
    } else {
      // console.log('no summary', summary)
    }

    return null
  })
)
