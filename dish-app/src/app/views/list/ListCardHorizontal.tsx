import { graphql } from '@dish/graph'
import React from 'react'
import { Text, VStack, useTheme } from 'snackui'

import { getImageUrl } from '../../../helpers/getImageUrl'
import { Image } from '../Image'
import { LinkButton } from '../LinkButton'
import { ListIDProps, useList } from './ListCard'

export const ListCardHorizontal = graphql((props: ListIDProps) => {
  const { list, colors, photos, backgroundColor } = useList(props)
  const { slug, userSlug, region } = props
  const theme = useTheme()

  if (!slug || !userSlug) {
    return null
  }

  return (
    <LinkButton
      name="list"
      asyncClick
      params={{ slug, userSlug, region }}
      borderRadius={15}
      padding={10}
      paddingHorizontal={12}
      backgroundColor={theme.cardBackgroundColor}
      borderWidth={1}
      elevation={2}
      shadowRadius={3}
      shadowOffset={{ height: 2, width: 0 }}
      maxHeight={80}
    >
      <Image
        source={{ uri: getImageUrl(photos[0] ?? '', 42, 42) }}
        style={{
          width: 42,
          height: 42,
          borderRadius: 100,
        }}
      />
      <VStack>
        <Text ellipse color={colors.darkColor} fontWeight="800">
          {list.name}
        </Text>
        <Text>{list.user?.username}</Text>
      </VStack>
    </LinkButton>
  )
})