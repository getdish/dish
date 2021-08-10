import React from 'react'
import { AbsoluteHStack, AbsoluteVStack, Text, VStack, useTheme } from 'snackui'

import { DishTagItem } from '../../helpers/getRestaurantDishes'
import { rgbString } from '../../helpers/rgb'
import { TagButton } from '../views/TagButton'
import { Card, CardOverlay, CardProps } from './restaurant/Card'

export type FeedCardProps = {
  title?: string | JSX.Element | null
  children?: any
  author?: string
  tags?: DishTagItem[]
  photo?: string | null
  size?: CardProps['size']
  square?: boolean
  variant?: 'flat'
  chromeless?: boolean
  backgroundColor?: string
  floating?: boolean
  emphasizeTag?: boolean
}

export const FeedCard = ({
  title,
  author,
  tags = [],
  size = 'sm',
  square,
  photo,
  floating,
  variant,
  children,
  chromeless,
  backgroundColor,
  emphasizeTag,
}: FeedCardProps) => {
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
      floating={floating}
      backgroundColor={backgroundColor}
      outside={
        <>
          <CardOverlay flat={chromeless || variant === 'flat'}>
            {children}

            <AbsoluteHStack
              top={0}
              right={0}
              scale={emphasizeTag ? 1.075 : 0.75}
              x={emphasizeTag ? -5 : 0}
              y={emphasizeTag ? 5 : 0}
            >
              {tags.map((tag) => (
                <TagButton
                  key={tag.slug}
                  onlyIcon={tags.length > 1 && tag.type === 'lense'}
                  size={emphasizeTag ? 'lg' : 'md'}
                  fontWeight={emphasizeTag ? '300' : '700'}
                  {...tag}
                />
              ))}
            </AbsoluteHStack>

            <VStack flex={1} />

            <Text
              className="hover-100-opacity-child"
              fontWeight={emphasizeTag ? '300' : '700'}
              fontSize={emphasizeTag ? (size === 'sm' ? 13 : 18) : size === 'sm' ? 16 : 23}
              color={colorString}
              // opacity={0.8}
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
