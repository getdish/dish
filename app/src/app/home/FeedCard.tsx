import { isWeb } from '../../constants/constants'
import { DishTagItem } from '../../helpers/getRestaurantDishes'
import { pluralize } from '../../helpers/pluralize'
import { TagButton } from '../views/TagButton'
import { FontTheme } from '../views/TitleStyled'
import { Card, CardProps } from './restaurant/Card'
import {
  AbsoluteXStack,
  H2,
  Paragraph,
  XStack,
  YStack,
  getFontSizeToken,
  useTheme,
} from '@dish/ui'
import React from 'react'
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
      <View style={[StyleSheet.absoluteFill]} />

      <FeedCardContent {...props} />
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
  theme: cardTheme = 'modern',
}: // & { galleryRef: RefObject<GalleryRef> }
FeedCardProps) => {
  const titleLen = typeof title === 'string' ? title.length : 20
  const relativeSize = Math.max(1, Math.min(4, Math.round(30 / titleLen)))
  // @ts-expect-error
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
      bc="$background"
      borderColor="$backgroundHover"
      hoverStyle={{
        borderColor: '$backgroundFocus',
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
            <H2 cur="inherit" color="$colorFocus" size={titleSize || undefined}>
              {title}
            </H2>
          </YStack>

          {!!(author || typeof numItems !== 'undefined') && (
            // @ts-expect-error
            <Paragraph cursor="inherit" size={size} opacity={0.6}>
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
    </XStack>
  )
}
