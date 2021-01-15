import { graphql } from '@dish/graph'
import { ellipseText } from '@dish/helpers'
import { capitalize } from 'lodash'
import React, { memo, useState } from 'react'
import {
  AbsoluteVStack,
  Button,
  HStack,
  Input,
  Paragraph,
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
  }: {
    restaurantSlug: string
    fullHeight?: boolean
    size?: 'lg'
    text?: string
    editableDescription?: boolean
    onEdit?: (next: string) => void
    disableEllipse?: boolean
  }) {
    const theme = useTheme()
    const [restaurant] = queryRestaurant(restaurantSlug)
    const headlines = (restaurant.headlines() ?? [])
      .slice(0, 2)
      .map((x) => x.sentence)
      .join(' ')
    const summary = text ?? restaurant.summary ?? headlines
    const scale = 2.1 - Math.max(1.0, Math.min(1.1, summary.length / 250))
    const extra = size === 'lg' ? 1 : 0
    const lineHeight = Math.round((size === 'lg' ? 26 : 24) * scale + extra)
    const fontSize = Math.round(16 * scale + extra)
    const [isEditing, setIsEditing] = useState(false)

    if (summary) {
      return (
        <HStack
          maxHeight={fullHeight ? 'auto' : lineHeight * 4 - 2}
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
                onBlur={(e) => onEdit(e.target['value'])}
              />
              <Text
                marginTop={10}
                alignSelf="flex-end"
                color={blue}
                onPress={() => {
                  setIsEditing(false)
                }}
              >
                Cancel
              </Text>
            </VStack>
          ) : (
            <Text
              display="flex"
              marginTop="auto"
              marginBottom="auto"
              fontSize={fontSize}
              lineHeight={lineHeight}
              opacity={1}
              color={theme.color}
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

              {editableDescription && (
                <Text
                  marginLeft={5}
                  color={blue}
                  onPress={() => {
                    setIsEditing(true)
                  }}
                >
                  Edit &raquo;
                </Text>
              )}
            </Text>
          )}
        </HStack>
      )
    }

    return null
  })
)
