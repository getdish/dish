import { tagDisplayName } from '../../constants/tagDisplayName'
import { rgbString } from '../../helpers/rgb'
import { NavigableTag } from '../../types/tagTypes'
import { Link } from './Link'
import { Paragraph, Text, YStack, useMedia } from '@dish/ui'
import React from 'react'
import { Pressable } from 'react-native'

export type LenseButtonSize = 'md' | 'lg' | 'xl'

export const LenseButton = ({
  lense,
  isActive,
  minimal,
  size = 'md',
  backgroundColor,
  onPress,
}: {
  lense: NavigableTag
  isActive?: boolean
  backgroundColor?: string
  minimal?: boolean
  size?: LenseButtonSize
  onPress?: (e: any) => any
}) => {
  const media = useMedia()
  const lenseColorLight = rgbString(lense.rgb, media.sm ? 0.6 : 0.4)
  const lenseColorDark = rgbString(lense.rgb.map((x) => x * 1.2))
  const scale = size == 'md' ? 1 : size === 'lg' ? 1.15 : 1.2
  const sizePx = media.sm ? 42 : 42
  const bg = backgroundColor ?? (isActive ? lenseColorLight : 'transparent')
  const iconSize = sizePx * (isActive ? 0.6 : 0.4) * scale
  const scaledSize = sizePx * scale
  const scaledWidth = scaledSize
  const color = media.sm || isActive ? '#ffffff' : lenseColorDark
  const lineHeight = sizePx * scale * 0.39
  const name = tagDisplayName(lense)
  const isLong = name.length > 4

  return (
    <Link onPress={onPress} tag={lense} replace asyncClick disallowDisableWhenActive>
      <YStack
        className="unselectable ease-in-out-fastest"
        alignItems="center"
        justifyContent="center"
        width={scaledWidth}
        height={scaledSize}
        backgroundColor={bg}
        hoverStyle={{
          backgroundColor: '$backgroundPress',
        }}
        borderRadius={100}
        marginRight={10}
        scale={isActive ? 1.3 : 1}
        {...(media.sm && {
          marginRight: 5,
          transform: [
            {
              scale: isActive ? 1.25 : 0.85,
            },
          ],
        })}
        padding={0}
        marginTop={-10}
        pressStyle={{
          backgroundColor: '$backgroundPress',
        }}
      >
        <Text fontSize={iconSize} lineHeight={scaledSize} textAlign="center">
          {(lense.icon ?? '').trim()}
        </Text>
        <YStack
          rotate="-10deg"
          zIndex={100}
          alignItems="center"
          borderRadius={4}
          paddingHorizontal={4}
          marginTop={-10}
          backgroundColor="transparent"
          {...(isActive && {
            backgroundColor: lenseColorDark,
          })}
        >
          <Paragraph
            fontWeight="700"
            lineHeight={lineHeight}
            fontSize={isLong ? 12 : 14}
            color={color}
            textAlign="center"
            cursor="pointer"
            height={16}
            ellipse
          >
            {name}
          </Paragraph>
        </YStack>
      </YStack>
    </Link>
  )
}
