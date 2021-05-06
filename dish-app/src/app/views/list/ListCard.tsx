import { graphql } from '@dish/graph'
import React from 'react'
import { AbsoluteVStack, HStack, Hoverable, VStack } from 'snackui'

import { getColorsForName } from '../../../helpers/getColorsForName'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { queryList } from '../../../queries/queryList'
import { getListColor } from '../../home/list/listColors'
import { Card } from '../../home/restaurant/Card'
import { Image } from '../Image'
import { Link } from '../Link'
import { Score } from '../Score'

export type ListIDProps = {
  slug?: string
  userSlug?: string
  region: string
}

export const useList = ({ slug }: ListIDProps) => {
  const [list] = slug ? queryList(slug) : []
  const colors = getColorsForName(list?.name ?? '')
  const photos = list
    ?.restaurants({
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
  const backgroundColor = getListColor(list?.color) ?? colors.color
  return { list, colors, photos, backgroundColor }
}

export const ListCard = graphql(
  (
    props: ListIDProps & {
      onHover?: (is: boolean) => any
      hoverable?: boolean
      isBehind?: boolean
    }
  ) => {
    const { list, colors, photos, backgroundColor } = useList(props)
    const { slug, userSlug, region, onHover, hoverable, isBehind } = props

    if (!slug || !userSlug) {
      return <Card title="" size="sm" />
    }

    const contents = (
      <Link name="list" asyncClick params={{ slug, userSlug, region }}>
        <Card
          aspectFixed
          square
          hoverable={hoverable}
          title={list.name}
          subTitle={`by ${list.user?.name ?? list.user?.username ?? ''}`}
          backgroundColor={backgroundColor}
          isBehind={isBehind}
          outside={
            <AbsoluteVStack zIndex={1000000} top="-5%" right="-5%">
              <Score
                size="sm"
                score={Math.round(Math.random() * 100)}
                rating={Math.random() * 100}
              />
            </AbsoluteVStack>
          }
          photo={
            <VStack alignItems="center" justifyContent="center" flex={1}>
              <HStack flexWrap="wrap">
                {photos.map((photo, index) => {
                  const uri = getImageUrl(photo ?? '', 93, 93)
                  if (!uri) {
                    return null
                  }
                  return (
                    <Image
                      key={index}
                      style={{ width: 93, height: 93, opacity: 0.5 }}
                      source={{ uri }}
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
        <Hoverable onHoverIn={() => onHover(true)} onHoverOut={() => onHover(true)}>
          {contents}
        </Hoverable>
      )
    }

    return contents
  }
)
