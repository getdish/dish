import React, { memo } from 'react'
import { HStack, Text, VStack, isStringChild, useMedia, useTheme } from 'snackui'

export const PageTitle = memo(
  ({
    title,
    before,
    after,
    subTitle,
    color,
    size = 'md',
    noDivider,
  }: {
    title: any
    before?: any
    after?: any
    subTitle?: string
    color?: string
    size?: 'md' | 'sm'
    noDivider?: boolean
  }) => {
    const titleLen = (title + subTitle).length
    const titleSize = size == 'sm' ? 0.75 : 1
    const titleScale =
      titleLen > 65 ? 0.7 : titleLen > 55 ? 0.75 : titleLen > 45 ? 0.85 : titleLen > 35 ? 0.95 : 1
    const titleFontSize = Math.round(26 * titleScale * titleSize)
    const theme = useTheme()
    const contents = (
      <>
        {title}
        {subTitle ? <Text>' '</Text> : null}
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
      </>
    )
    return (
      <HStack
        paddingHorizontal={15}
        paddingBottom={12}
        overflow="hidden"
        justifyContent="center"
        alignItems="center"
        position="relative"
      >
        {before}
        <HStack spacing="xxl" flex={1} alignItems="center" justifyContent="center">
          {!noDivider && <VStack backgroundColor={theme.borderColor} height={1} flex={1} />}
          {isStringChild(contents) ? (
            <Text
              textAlign="center"
              letterSpacing={-0.25}
              fontSize={titleFontSize}
              fontWeight="800"
              color={color}
              flex={1}
              overflow="hidden"
            >
              {contents}
            </Text>
          ) : (
            contents
          )}
          {!noDivider && <VStack backgroundColor={theme.borderColor} height={1} flex={1} />}
        </HStack>
        {after}
      </HStack>
    )
  }
)
