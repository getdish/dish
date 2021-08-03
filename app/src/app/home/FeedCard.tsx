import React from 'react'
import { AbsoluteVStack, Text, VStack, useTheme } from 'snackui'

import { DishTagItem } from '../../helpers/getRestaurantDishes'
import { rgbString } from '../../helpers/rgb'
import { TagButton } from '../views/TagButton'
import { Card, CardOverlay } from './restaurant/Card'

export const FeedCard = ({
  title,
  author,
  tags = [],
  size = 'sm',
  square,
  photo,
  variant,
  children,
  chromeless,
  backgroundColor,
  emphasizeTag,
}: {
  title?: string | JSX.Element | null
  children?: any
  author?: string
  tags?: DishTagItem[]
  photo?: string | null
  size?: any
  square?: boolean
  variant?: 'flat'
  chromeless?: boolean
  backgroundColor?: string
  emphasizeTag?: boolean
}) => {
  const theme = useTheme()
  const color = tags[0]?.rgb ?? [200, 150, 150]
  const colorString = rgbString(color)
  return (
    <Card
      className="hover-parent"
      dimImage
      chromeless={chromeless}
      variant={variant}
      size={size}
      square={square}
      borderless={!!backgroundColor}
      hoverEffect="background"
      photo={photo}
      backgroundColor={backgroundColor}
      outside={
        <>
          <CardOverlay flat={chromeless || variant === 'flat'}>
            {children}

            {tags.map((tag) => (
              <AbsoluteVStack top={0} right={0} key={tag.slug} scale={emphasizeTag ? 1 : 0.75}>
                <TagButton {...tag} />
              </AbsoluteVStack>
            ))}

            <VStack flex={1} />

            <Text
              className="hover-100-opacity-child"
              fontWeight="800"
              fontSize={emphasizeTag ? (size === 'sm' ? 13 : 18) : size === 'sm' ? 16 : 23}
              color={colorString}
              opacity={0.8}
            >
              {title}
            </Text>

            {!!author && (
              <Text color={theme.color} fontWeight="300" marginTop={8} opacity={0.5}>
                {author}
              </Text>
            )}
          </CardOverlay>
          {/* <ListFavoriteButton {...props} />*/}
        </>
      }
    />
  )
}
