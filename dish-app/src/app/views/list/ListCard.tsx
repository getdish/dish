import { graphql } from '@dish/graph/src'
import { ellipseText } from '@dish/helpers/src'
import React from 'react'
import { Image } from 'react-native'
import { HStack, VStack } from 'snackui'

import { getColorsForName } from '../../../helpers/getColorsForName'
import { queryList } from '../../../queries/queryList'
import { getListColor } from '../../home/list/listColors'
import { Card } from '../../home/restaurant/Card'
import { Link } from '../Link'

export const ListCard = graphql(
  ({ slug, userSlug }: { slug: string; userSlug: string }) => {
    const [list] = queryList(slug)
    const colors = getColorsForName(list.name ?? '')
    const photos = list
      .restaurants({
        limit: 10,
        where: {
          restaurant: {
            image: {
              _neq: null,
            },
          },
        },
      })
      .map((x) => x.restaurant.image)

    return (
      <Link name="list" asyncClick params={{ slug, userSlug }}>
        <Card
          size="sm"
          hoverable
          title={list.name}
          subTitle={`by ${list.user.name ?? list.user.username ?? ''}`}
          backgroundColor={getListColor(list.color) ?? colors.color}
          photo={
            <VStack alignItems="center" justifyContent="center" flex={1}>
              <HStack flexWrap="wrap">
                {photos.map((photo, index) => {
                  return (
                    <Image
                      key={index}
                      style={{ width: 100, height: 100 }}
                      source={{ uri: photo }}
                    />
                  )
                })}
              </HStack>
            </VStack>
          }
        />
      </Link>
    )
  }
)
