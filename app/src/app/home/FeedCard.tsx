import React from 'react'
import { AbsoluteHStack, Paragraph, Text, VStack } from 'snackui'

import { DishTagItem } from '../../helpers/getRestaurantDishes'
import { pluralize } from '../../helpers/pluralize'
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
  color?: string
  theme?: 'modern' | 'minimal'
}

export const FeedCard = ({
  title,
  author,
  tags = [],
  color,
  size = 'sm',
  children,
  numItems,
  outside,
  photo,
  theme = 'modern',
  ...cardProps
}: FeedCardProps) => {
  const isMinimal = theme === 'minimal'
  const { chromeless, emphasizeTag, flat } = cardProps
  const colorString = !isMinimal ? undefined : color || rgbString(tags[0]?.rgb ?? [200, 150, 150])
  const longTitle = typeof title === 'string' && title.length > 15 ? true : false

  const fontSize = Math.round(
    emphasizeTag
      ? size === 'sm' || size.endsWith('xs')
        ? 12
        : longTitle
        ? 12
        : 18
      : size === 'sm' || size.endsWith('xs')
      ? 15
      : longTitle
      ? 18
      : 24
  )

  // const dimensions = getCardDimensions({
  //   size,
  // })

  return (
    <Card
      className="hover-parent"
      dimImage
      borderless={!!cardProps.backgroundColor}
      hoverEffect="background"
      size={size}
      outside={
        <>
          {outside}

          {/* {!!photo && (
            <AbsoluteVStack pointerEvents="none" fullscreen overflow="hidden">
              <AbsoluteVStack
                className="hover-50-opacity-child"
                opacity={0}
                overflow="hidden"
                fullscreen
                zIndex={1}
              >
                {isValidElement(photo) ? (
                  photo
                ) : (
                  <Image
                    source={{ uri: photo as string }}
                    style={{
                      width: dimensions.width,
                      height: Math.round(dimensions.height * 1.333),
                    }}
                  />
                )}
              </AbsoluteVStack>
              <AbsoluteVStack
                zIndex={10}
                fullscreen
                opacity={0.5}
                y={10}
                className="hover-slide-up-child hover-75-opacity-child hover-linear-gradient-up"
              />
            </AbsoluteVStack>
          )} */}

          <CardOverlay flat={chromeless || flat}>
            <AbsoluteHStack
              top={0}
              right={0}
              scale={emphasizeTag ? 1.075 : 0.75}
              x={emphasizeTag ? -5 : 0}
              y={emphasizeTag ? 5 : 0}
              pointerEvents="auto"
            >
              {tags.map((tag) => (
                <TagButton
                  noLink
                  key={tag.slug}
                  onlyIcon={tags.length > 1 && tag.type === 'lense'}
                  transparent
                  size={emphasizeTag ? 'lg' : 'md'}
                  fontWeight={emphasizeTag ? '600' : '700'}
                  color={colorString}
                  {...tag}
                />
              ))}
            </AbsoluteHStack>

            {children}

            <VStack flex={1} />

            <VStack overflow="hidden" spacing={size}>
              {isMinimal ? (
                <Text
                  letterSpacing={-1}
                  className="hover-100-opacity-child"
                  fontWeight="300"
                  opacity={1}
                  fontSize={fontSize * 1.1}
                  color={colorString}
                >
                  {title}
                </Text>
              ) : (
                <Paragraph
                  letterSpacing={-0.25}
                  className="hover-100-opacity-child"
                  fontWeight={emphasizeTag ? '500' : '800'}
                  numberOfLines={2}
                  opacity={0.8}
                  fontSize={fontSize * 0.9}
                  // color="#fff"
                >
                  {title}
                </Paragraph>
              )}

              {!!(author || typeof numItems !== 'undefined') && (
                <Paragraph
                  size={size === 'xxs' || size === 'xs' || size === 'sm' ? 'sm' : 'md'}
                  fontWeight="300"
                  opacity={0.5}
                >
                  {typeof numItems !== 'undefined' ? (
                    <>{`${pluralize(numItems, 'item')}`} &middot; </>
                  ) : (
                    ''
                  )}
                  {author ?? ''}
                </Paragraph>
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
