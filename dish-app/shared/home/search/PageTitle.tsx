import React, { memo } from 'react'
import { HStack, Text, VStack, useMedia } from 'snackui'

export const PageTitle = memo(
  ({
    title,
    subTitle,
    color,
  }: {
    title: string
    subTitle?: string
    color?: string
  }) => {
    const media = useMedia()
    const titleLen = (title + subTitle).length
    const titleScale =
      titleLen > 65
        ? 0.7
        : titleLen > 55
        ? 0.75
        : titleLen > 45
        ? 0.85
        : titleLen > 35
        ? 0.95
        : 1
    const titleFontSize = 28 * titleScale * (media.sm ? 0.75 : 1)
    return (
      <HStack
        paddingHorizontal={15}
        paddingBottom={12}
        overflow="hidden"
        justifyContent="center"
        alignItems="center"
        spacing="xl"
      >
        <VStack backgroundColor="#f2f2f2" height={1} flex={1} />
        <Text
          textAlign="center"
          letterSpacing={-0.25}
          fontSize={titleFontSize}
          fontWeight="800"
          color={color}
        >
          {title}
          {subTitle ? ' ' : ''}
          {!!subTitle && (
            <Text
              // @ts-ignore
              display="inline" // safari fix
              fontWeight="300"
              opacity={0.5}
              className="nobreak"
            >
              {subTitle}
            </Text>
          )}
        </Text>
        <VStack backgroundColor="#f2f2f2" height={1} flex={1} />
      </HStack>
    )
  }
)
