import { ChevronRight } from '@dish/react-feather'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  AbsoluteHStack,
  AbsoluteVStack,
  HStack,
  LinearGradient,
  Paragraph,
  VStack,
  useTheme,
} from 'snackui'

import { AdvancedGallery } from '../../AdvancedGallery'
import { isWeb } from '../../constants/constants'
import { getImageUrl } from '../../helpers/getImageUrl'
import { DishTagItem } from '../../helpers/getRestaurantDishes'
import { getWindowWidth } from '../../helpers/getWindow'
import { pluralize } from '../../helpers/pluralize'
import { Image } from '../views/Image'
import { TagButton } from '../views/TagButton'
import { FontTheme, TitleStyled } from '../views/TitleStyled'
import { ListColors } from './list/listColors'
import { Card, CardProps } from './restaurant/Card'

export type FeedCardProps = CardProps & {
  fontTheme?: FontTheme
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

export const FeedCard = (props: FeedCardProps) => {
  const {
    title,
    author,
    tags = [],
    color,
    listColors,
    size = 'sm',
    fontTheme,
    children,
    numItems,
    photo,
    items,
    theme: cardTheme = 'modern',
    ...cardProps
  } = props
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  console.log('dimensions', dimensions)
  return (
    <Card
      className="hover-parent"
      overflowHidden
      dimImage
      borderless={!!cardProps.backgroundColor}
      hoverEffect={'background'}
      size={size}
      {...cardProps}
    >
      <View
        style={[StyleSheet.absoluteFill]}
        onLayout={(e) => {
          setDimensions(e.nativeEvent.layout)
        }}
      />
      {!!dimensions.width && (
        <AdvancedGallery
          disableVerticalSwipe
          disableSwipeUp
          keyExtractor={(x) => x.id}
          renderItem={({ item, onLayout }) => {
            return (
              <View style={StyleSheet.absoluteFill} onLayout={onLayout}>
                {(() => {
                  if (item.id === -1) {
                    return <FeedCardContent {...props} />
                  }
                  return (
                    <VStack>
                      <AbsoluteVStack zIndex={0} borderRadius={10} overflow="hidden" fullscreen>
                        <Image
                          source={{ uri: item.image }}
                          resizeMode="cover"
                          style={StyleSheet.absoluteFill}
                        />
                      </AbsoluteVStack>
                      <AbsoluteVStack
                        fullscreen
                        alignItems="flex-start"
                        justifyContent="flex-end"
                        padding={10}
                        borderRadius={10}
                        overflow="hidden"
                      >
                        <LinearGradient
                          style={[StyleSheet.absoluteFill, { zIndex: 0 }]}
                          start={[0, 1]}
                          end={[0, 0]}
                          colors={[`#000000`, `#00000000`]}
                        />
                        <TitleStyled zIndex={10} size="xxl" color="#fff">
                          {item.title}
                        </TitleStyled>
                      </AbsoluteVStack>
                    </VStack>
                  )
                })()}
              </View>
            )
          }}
          containerDimensions={dimensions}
          data={[{ id: -1, image: '' }, ...(items || [])]}
        />
      )}
    </Card>
  )
}

const FeedCardContent = ({
  title,
  author,
  tags = [],
  color,
  listColors,
  size = 'sm',
  fontTheme,
  children,
  numItems,
  photo,
  items,
  emphasizeTag,
  theme: cardTheme = 'modern',
}: FeedCardProps) => {
  const titleLen = typeof title === 'string' ? title.length : 20
  const lenScale =
    titleLen > 55 ? 0.6 : titleLen > 40 ? 0.75 : titleLen > 30 ? 0.9 : titleLen > 20 ? 1.05 : 1.5
  const tagScale = emphasizeTag ? 0.8 : 1
  const sizeScale = size === 'xs' ? 0.7 : size === 'sm' ? 0.8 : size === 'lg' ? 1.1 : 1
  const isSmallDevice = Math.min(getWindowWidth(), getWindowWidth()) < 420
  const deviceScale = isSmallDevice ? 0.75 : 1
  const fontSize = Math.round(24 * lenScale * tagScale * sizeScale * deviceScale)
  const imgSize = 350
  const theme = useTheme()
  return (
    <HStack height="100%" padding={10} alignItems="center">
      <VStack maxWidth="80%">
        {typeof photo === 'string' && (
          <AbsoluteVStack
            pointerEvents="none"
            opacity={0.6}
            borderRadius={8}
            fullscreen
            overflow="hidden"
          >
            {/* <Image
              source={{ uri: getImageUrl(photo, imgSize, imgSize) }}
              style={{ width: imgSize, height: imgSize }}
            /> */}
            <LinearGradient
              style={StyleSheet.absoluteFill}
              start={[1, 0]}
              end={[0, 0]}
              colors={[`${listColors?.backgroundForTheme}00`, listColors?.backgroundForTheme || '']}
            />
          </AbsoluteVStack>
        )}
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

        <VStack
          backgroundColor={`${listColors?.backgroundForTheme}dd`}
          padding={10}
          borderRadius={12}
          position="relative"
          overflow="hidden"
          spacing="xs"
        >
          <VStack position="relative" display={isWeb ? 'block' : 'flex'}>
            <TitleStyled
              fontTheme={fontTheme}
              // backgroundColor={cardProps.backgroundColor as any}
              letterSpacing={-1}
              fontWeight="300"
              fontSize={fontSize}
              lineHeight={fontSize * 1.2}
              // color="#000"
              // color={listColors?.colorForTheme}
              // backgroundColor={listColors?.lightColor}
            >
              {title}
            </TitleStyled>
          </VStack>

          {!!(author || typeof numItems !== 'undefined') && (
            <Paragraph
              size={size === 'xxs' || size === 'xs' || size === 'sm' ? 'xs' : 'sm'}
              fontWeight="300"
              // color="#fff"
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
      </VStack>

      <VStack zIndex={100000} position="relative">
        <ChevronRight color="#fff" size={30} />
      </VStack>
    </HStack>
  )
}
