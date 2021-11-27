import { AbsoluteXStack, H1, Paragraph, XStack, YStack, prevent, useTheme } from '@dish/ui'
import { ChevronRight } from '@tamagui/feather-icons'
import React, { RefObject, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { isWeb } from '../../constants/constants'
import { DishTagItem } from '../../helpers/getRestaurantDishes'
import { getWindowWidth } from '../../helpers/getWindow'
import { pluralize } from '../../helpers/pluralize'
import { GalleryRef } from '../../SwipeGallery'
import { TagButton } from '../views/TagButton'
import { FontTheme } from '../views/TitleStyled'
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
  // listColors?: ListColors
}

export const FeedCard = (props: FeedCardProps) => {
  const {
    title,
    author,
    tags = [],
    color,
    // listColors,
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
  const galleryRef = useRef<GalleryRef>(null)
  return (
    <Card
      className="hover-parent"
      overflowHidden
      dimImage
      borderless
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

      <FeedCardContent galleryRef={galleryRef} {...props} />

      {/* {!!dimensions.width && (
        <SwipeGallery
          ref={galleryRef}
          disableVerticalSwipe
          disableSwipeUp
          disablePinchToZoom
          disableTapToZoom
          keyExtractor={(x, i) => x.id || i}
          renderItem={({ item, onLayout }) => {
            return (
              <View style={StyleSheet.absoluteFill} onLayout={onLayout}>
                {(() => {
                  if (item.id === -1) {
                    return <FeedCardContent galleryRef={galleryRef} {...props} />
                  }
                  return (
                    <YStack>
                      <AbsoluteYStack zIndex={0} borderRadius={10} overflow="hidden" fullscreen>
                        <Image
                          source={{ uri: item.image }}
                          resizeMode="cover"
                          style={StyleSheet.absoluteFill}
                        />
                      </AbsoluteYStack>
                      <AbsoluteYStack
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
                      </AbsoluteYStack>
                    </YStack>
                  )
                })()}
              </View>
            )
          }}
          containerDimensions={dimensions}
          data={[{ id: -1, image: '' }, ...(items || [])]}
        />
      )} */}
    </Card>
  )
}

const FeedCardContent = ({
  title,
  author,
  tags = [],
  size = 'sm',
  fontTheme,
  children,
  numItems,
  photo,
  items,
  emphasizeTag,
  galleryRef,
  theme: cardTheme = 'modern',
}: FeedCardProps & { galleryRef: RefObject<GalleryRef> }) => {
  const titleLen = typeof title === 'string' ? title.length : 20
  const lenScale =
    titleLen > 55 ? 0.6 : titleLen > 40 ? 0.75 : titleLen > 30 ? 0.9 : titleLen > 20 ? 1.05 : 1.5
  const tagScale = emphasizeTag ? 0.8 : 1
  const sizeScale = size === 'xs' ? 0.7 : size === 'sm' ? 0.8 : size === 'lg' ? 1.1 : 1
  const isSmallDevice = Math.min(getWindowWidth(), getWindowWidth()) < 420
  const deviceScale = isSmallDevice ? 0.75 : 1
  const fontSize = Math.round(24 * lenScale * tagScale * sizeScale * deviceScale)
  const theme = useTheme()
  return (
    <XStack
      className="safari-fix-overflow"
      br="$3"
      overflow="hidden"
      height="100%"
      p="$2"
      ai="center"
      bw={1}
      pointerEvents="auto"
      borderColor="$bg2"
      hoverStyle={{
        borderColor: '$bg4',
      }}
    >
      <YStack mt="auto" maxWidth="85%">
        <AbsoluteXStack
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
        </AbsoluteXStack>

        {children}

        <YStack flex={1} />

        <YStack p="$2" br="$2" position="relative" overflow="hidden" space="$1">
          <YStack position="relative" display={isWeb ? 'block' : 'flex'}>
            <H1 color="$color3" fontSize={fontSize} lineHeight={fontSize * 1.2}>
              {title}
            </H1>
          </YStack>

          {!!(author || typeof numItems !== 'undefined') && (
            <Paragraph
              size={size === 'xxs' || size === 'xs' || size === 'sm' ? '$2' : '$3'}
              fontWeight="300"
              opacity={0.6}
            >
              {typeof numItems !== 'undefined' ? (
                <>{`${pluralize(numItems, 'item')}`} &middot; </>
              ) : (
                ''
              )}
              {author ?? ''}
            </Paragraph>
          )}
        </YStack>
      </YStack>

      <YStack flex={1} />

      <YStack
        onPress={(e) => {
          prevent(e)
          galleryRef.current?.setIndex(1)
        }}
        opacity={0.4}
        hoverStyle={{ opacity: 1 }}
        zIndex={100000}
        position="relative"
      >
        <ChevronRight color="#fff" size={20} />
      </YStack>
    </XStack>
  )
}
