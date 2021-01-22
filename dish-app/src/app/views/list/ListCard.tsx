import { graphql } from '@dish/graph'
import React from 'react'
import { Image } from 'react-native'
import { HStack, Hoverable, VStack } from 'snackui'

import { getColorsForName } from '../../../helpers/getColorsForName'
import { queryList } from '../../../queries/queryList'
import { getListColor } from '../../home/list/listColors'
import { Card } from '../../home/restaurant/Card'
import { Link } from '../Link'

export const ListCard = graphql(
  ({
    slug,
    userSlug,
    onHover,
    hoverable,
  }: {
    slug: string
    userSlug: string
    onHover?: (is: boolean) => void
    hoverable?: boolean
  }) => {
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

    const contents = (
      <Link name="list" asyncClick params={{ slug, userSlug }}>
        <Card
          size="sm"
          hoverable={hoverable}
          title={list.name}
          subTitle={`by ${list.user?.name ?? list.user?.username ?? ''}`}
          backgroundColor={getListColor(list.color) ?? colors.color}
          photo={
            <VStack alignItems="center" justifyContent="center" flex={1}>
              <HStack flexWrap="wrap">
                {photos.map((photo, index) => {
                  return (
                    <Image
                      key={index}
                      style={{ width: 80, height: 80 }}
                      source={{ uri: photo ?? '' }}
                    />
                  )
                })}
              </HStack>
            </VStack>
          }
        />
      </Link>
    )

    if (onHover) {
      return (
        <Hoverable
          onHoverIn={() => onHover(true)}
          onHoverOut={() => onHover(true)}
        >
          {contents}
        </Hoverable>
      )
    }

    return contents
  }
)
