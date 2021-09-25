import React, { isValidElement } from 'react'
import { AbsoluteHStack, AbsoluteVStack, Paragraph, Text, VStack, useTheme } from 'snackui'

import { isWeb } from '../../constants/constants'
import { getImageUrl } from '../../helpers/getImageUrl'
import { DishTagItem } from '../../helpers/getRestaurantDishes'
import { pluralize } from '../../helpers/pluralize'
import { rgbString } from '../../helpers/rgb'
import { Image } from '../views/Image'
import { TagButton } from '../views/TagButton'
import { TitleStyled } from '../views/TitleStyled'
import { ListColors } from './list/listColors'
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
  listColors?: ListColors
}

export const FeedCard = ({
  title,
  author,
  tags = [],
  color,
  listColors,
  size = 'sm',
  children,
  numItems,
  outside,
  photo,
  theme: cardTheme = 'modern',
  ...cardProps
}: FeedCardProps) => {
  const { chromeless, emphasizeTag, flat } = cardProps
  const titleLen = typeof title === 'string' ? title.length : 20
  const lenScale = titleLen > 40 ? 0.68 : titleLen > 30 ? 0.75 : titleLen > 20 ? 0.85 : 1.2
  const tagScale = emphasizeTag ? 0.8 : 1
  const sizeScale = size === 'xs' ? 0.7 : size === 'sm' ? 0.8 : size === 'lg' ? 1.1 : 1
  const fontSize = Math.round(24 * lenScale * tagScale * sizeScale)
  const imgSize = size === 'lg' ? 85 : 70
  const theme = useTheme()

  return (
    <Card
      className="hover-parent"
      dimImage
      borderless={!!cardProps.backgroundColor}
      hoverEffect={
        'background'
        // listColors?.backgroundColor === '#000000' || listColors?.backgroundColor === '#ffffff'
        //   ? null
        // : 'background'
      }
      size={size}
      {...cardProps}
      outside={
        <>
          {outside}

          {typeof photo === 'string' && (
            <AbsoluteVStack fullscreen overflow="hidden">
              <AbsoluteVStack borderRadius={100} overflow="hidden" top={-20} right={-20}>
                <Image
                  source={{ uri: getImageUrl(photo, imgSize, imgSize) }}
                  style={{ width: imgSize, height: imgSize }}
                />
              </AbsoluteVStack>
            </AbsoluteVStack>
          )}

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
                  color={theme.color}
                  {...tag}
                />
              ))}
            </AbsoluteHStack>

            {children}

            <VStack flex={1} />

            <VStack overflow="hidden" spacing={size}>
              <VStack position="relative" display={isWeb ? 'block' : 'flex'}>
                <TitleStyled
                  // backgroundColor={cardProps.backgroundColor as any}
                  letterSpacing={-1}
                  fontWeight="300"
                  fontSize={fontSize}
                  lineHeight={fontSize * 1.455}
                  color={listColors?.colorForTheme}
                  // backgroundColor={listColors?.lightColor}
                >
                  {title}
                </TitleStyled>
                <AbsoluteHStack zIndex={-1} fullscreen display={isWeb ? 'block' : 'flex'}>
                  <TitleStyled
                    // backgroundColor={cardProps.backgroundColor as any}
                    letterSpacing={-1}
                    fontWeight="300"
                    fontSize={fontSize}
                    lineHeight={fontSize * 1.455}
                    color="transparent"
                    backgroundColor={`${listColors?.backgroundForTheme}cc`}
                  >
                    {title}
                  </TitleStyled>
                </AbsoluteHStack>
              </VStack>

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
    />
  )
}
