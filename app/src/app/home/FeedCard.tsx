import { GalleryRef } from '../../SwipeGallery'
import { isWeb } from '../../constants/constants'
import { DishTagItem } from '../../helpers/getRestaurantDishes'
import { pluralize } from '../../helpers/pluralize'
import { TagButton } from '../views/TagButton'
import { FontTheme } from '../views/TitleStyled'
import { Card, CardProps } from './restaurant/Card'
import { AbsoluteXStack, H2, Paragraph, XStack, YStack, getFontSizeToken, useTheme } from '@dish/ui'
import React, { RefObject, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'

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
    size = '$4',
    fontTheme,
    children,
    numItems,
    photo,
    items,
    theme: cardTheme = 'modern',
    ...cardProps
  } = props
  // const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
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
        // onLayout={(e) => {
        //   setDimensions(e.nativeEvent.layout)
        // }}
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
                        <TitleStyled zIndex={10} size="$8" color="#fff">
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
  size = '$4',
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
  const relativeSize = Math.max(1, Math.min(4, Math.round(60 / titleLen)))
  const titleSize = getFontSizeToken(size, {
    relativeSize,
  })
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
      bc="$bg"
      borderColor="$backgroundHover"
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
              size={emphasizeTag ? '$5' : '$4'}
              fontWeight={emphasizeTag ? '600' : '700'}
              color={theme.color}
              {...tag}
            />
          ))}
        </AbsoluteXStack>

        {children}

        <YStack flex={1} />

        <YStack p="$2" br="$2" pos="relative" ov="hidden" space="$1">
          <YStack position="relative" display={isWeb ? 'block' : 'flex'}>
            <H2 color="$color4" fontWeight="300" size={titleSize || undefined}>
              {title}
            </H2>
          </YStack>

          {!!(author || typeof numItems !== 'undefined') && (
            <Paragraph size={size} fontWeight="300" opacity={0.6}>
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

      {/* <YStack flex={1} /> */}
      {/* <YStack
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
      </YStack> */}
    </XStack>
  )
}
