import { graphql } from '@dish/graph'
import React from 'react'
import { Button, Text, VStack, useTheme } from 'snackui'

import { getImageUrl } from '../../../helpers/getImageUrl'
import { Image } from '../Image'
import { Link } from '../Link'
import { ListIDProps } from './ListCard'
import { useList } from './useList'

export const ListCardHorizontal = graphql((props: ListIDProps) => {
  const { list, colors, photos, backgroundColor } = useList(props)
  const { slug, userSlug } = props
  const theme = useTheme()

  if (!slug || !userSlug) {
    return null
  }

  return (
    <Link name="list" asyncClick params={{ slug, userSlug }}>
      <Button
        alignSelf="center"
        borderRadius={15}
        padding={10}
        paddingHorizontal={12}
        borderWidth={0}
        noTextWrap
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
          <Text ellipse color={theme.color} fontWeight="800">
            {list.name}
          </Text>
          <Text color={theme.colorSecondary} fontSize={14}>
            {list.user?.username}
          </Text>
        </VStack>
      </Button>
    </Link>
  )
})
