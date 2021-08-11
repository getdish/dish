import React from 'react'
import { AbsoluteHStack, Text, VStack, useTheme } from 'snackui'

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
  pressable?: boolean
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
  pressable,
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
      pressable={pressable}
      outside={
        <>
          <CardOverlay flat={chromeless || variant === 'flat'}>
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

            <VStack flex={1} />

            <VStack spacing={size}>
              {children}
              <Text
                className="hover-100-opacity-child"
                fontWeight={emphasizeTag ? '400' : '700'}
                fontSize={
                  emphasizeTag
                    ? size === 'sm' || size.endsWith('xs')
                      ? 13
                      : 18
                    : size === 'sm' || size.endsWith('xs')
                    ? 16
                    : 23
                }
                color={colorString}
              >
                {title}
              </Text>
              {!!author && (
                <Text color={theme.color} fontWeight="300" marginTop={8} opacity={0.5}>
                  {author ?? ''}
                </Text>
              )}
            </VStack>
          </CardOverlay>
          {/* <ListFavoriteButton {...props} />*/}
        </>
      }
    />
  )
}
