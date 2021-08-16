import React from 'react'
import { AbsoluteHStack, Text, VStack, useTheme } from 'snackui'

import { DishTagItem } from '../../helpers/getRestaurantDishes'
import { rgbString } from '../../helpers/rgb'
import { TagButton } from '../views/TagButton'
import { Card, CardOverlay, CardProps } from './restaurant/Card'

export type FeedCardProps = CardProps & {
  author?: string
  children?: any
  numItems?: number
  tags?: DishTagItem[]
  title?: string | JSX.Element | null
  emphasizeTag?: boolean
}

export const FeedCard = ({
  title,
  author,
  tags = [],
  size = 'sm',
  children,
  numItems,
  ...cardProps
}: FeedCardProps) => {
  const { chromeless, emphasizeTag, flat } = cardProps
  const theme = useTheme()
  const color = tags[0]?.rgb ?? [200, 150, 150]
  const colorString = rgbString(color)
  const longTitle = typeof title === 'string' && title.length > 15 ? true : false
  return (
    <Card
      className="hover-parent"
      dimImage
      borderless={!!cardProps.backgroundColor}
      hoverEffect="background"
      size={size}
      outside={
        <>
          <CardOverlay flat={chromeless || flat}>
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
                  color={colorString}
                  {...tag}
                />
              ))}
            </AbsoluteHStack>

            {children}

            <VStack flex={1} />

            <VStack spacing={size}>
              <Text
                letterSpacing={-0.5}
                className="hover-100-opacity-child"
                fontWeight={emphasizeTag ? '400' : '700'}
                fontSize={
                  emphasizeTag
                    ? size === 'sm' || size.endsWith('xs')
                      ? 12
                      : longTitle
                      ? 12
                      : 18
                    : size === 'sm' || size.endsWith('xs')
                    ? 15
                    : longTitle
                    ? 22
                    : 28
                }
                color={colorString}
              >
                {title}
              </Text>
              {!!(author || typeof numItems !== 'undefined') && (
                <Text color={theme.color} fontWeight="300" marginTop={8} opacity={0.5}>
                  {numItems ? <>{`${numItems}`} &middot; </> : ''}
                  {author ?? ''}
                </Text>
              )}
            </VStack>
          </CardOverlay>
          {/* <ListFavoriteButton {...props} />*/}
        </>
      }
      {...cardProps}
    />
  )
}
