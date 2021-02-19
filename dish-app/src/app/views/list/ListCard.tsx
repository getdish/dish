import { graphql } from '@dish/graph'
import React from 'react'
import { Image } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  Hoverable,
  Text,
  VStack,
  useTheme,
} from 'snackui'

import { getColorsForName } from '../../../helpers/getColorsForName'
import { queryList } from '../../../queries/queryList'
import { getListColor } from '../../home/list/listColors'
import { Card } from '../../home/restaurant/Card'
import { DishUpvoteDownvote } from '../dish/DishUpvoteDownvote'
import { Link } from '../Link'
import { Score } from '../UpvoteDownvoteScore'

type ListIDProps = {
  slug: string | null
  userSlug: string | null
  region: string
}

const useList = ({ slug }: ListIDProps) => {
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
          size="sm"
          hoverable={hoverable}
          title={list.name}
          subTitle={`by ${list.user?.name ?? list.user?.username ?? ''}`}
          backgroundColor={backgroundColor}
          isBehind={isBehind}
          outside={
            <AbsoluteVStack zIndex={1000000} top="-2%" right="-2%">
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
                  return (
                    <Image
                      key={index}
                      style={{ width: 93, height: 93, opacity: 0.5 }}
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

export const ListCardHorizontal = graphql((props: ListIDProps) => {
  const { list, colors, photos, backgroundColor } = useList(props)
  const { slug, userSlug, region } = props
  const theme = useTheme()

  if (!slug || !userSlug) {
    return null
  }

  return (
    <Link name="list" asyncClick params={{ slug, userSlug, region }}>
      <HStack
        borderRadius={15}
        padding={10}
        paddingHorizontal={12}
        backgroundColor={colors.extraLightColor}
        borderWidth={1}
        borderColor={colors.lightColor}
        shadowColor={theme.shadowColor}
        shadowRadius={3}
        shadowOffset={{ height: 2, width: 0 }}
        maxHeight={80}
      >
        <Image
          source={{ uri: photos[0] ?? '' }}
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
      </HStack>
    </Link>
  )
})
