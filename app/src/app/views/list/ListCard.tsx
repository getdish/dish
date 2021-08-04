import { graphql } from '@dish/graph'
import React, { Suspense } from 'react'
import { AbsoluteVStack, HStack, Hoverable, Paragraph, VStack } from 'snackui'

import {
  cardFrameBorderRadius,
  cardFrameHeight,
  cardFrameWidth,
} from '../../../constants/constants'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { Card, CardProps } from '../../home/restaurant/Card'
import { FavoriteButton } from '../FavoriteButton'
import { Image } from '../Image'
import { Link } from '../Link'
import { SlantedTitle } from '../SlantedTitle'
import { useList, useListFavorite } from './useList'

export type ListIDProps = {
  slug?: string
  userSlug?: string
  region: string
}

const ListFavoriteButton = graphql((props: ListIDProps) => {
  const { isFavorited, toggleFavorite, reviewsCount } = useListFavorite(props)
  return (
    <FavoriteButton isFavorite={isFavorited} onToggle={toggleFavorite}>
      {reviewsCount}
    </FavoriteButton>
  )
})

export const ListCard = graphql(
  (
    props: ListIDProps & {
      onHover?: (is: boolean) => any
      hoverable?: boolean
      isBehind?: boolean
      size?: CardProps['size']
    }
  ) => {
    const { slug, userSlug, region, onHover, hoverable, isBehind, size } = props
    const { list, photos, backgroundColor } = useList(props)

    if (!slug || !userSlug) {
      return <Card title="" size="sm" />
    }

    const contents = (
      <Link name="list" asyncClick params={{ slug, userSlug }}>
        <Card
          aspectFixed
          square
          size={size}
          hoverEffect={hoverable ? 'scale' : false}
          backgroundColor={backgroundColor}
          // borderColor={backgroundColor}
          // backgroundColor="#fff"
          // isBehind={isBehind}
          outside={
            <>
              <AbsoluteVStack zIndex={1000000} top="-5%" right="-5%">
                <Suspense fallback={null}>
                  <ListFavoriteButton {...props} />
                </Suspense>
              </AbsoluteVStack>
              <AbsoluteVStack zIndex={1000000} bottom="-5%" left="-5%" right="-5%">
                <SlantedTitle maxWidth="87%" size="xs" backgroundColor="#000000cc" color="#fff">
                  {list.name}
                </SlantedTitle>
                <Paragraph size="sm" opacity={0.8} fontWeight="500" x={20} y={20}>
                  by {list.user?.name ?? list.user?.username ?? ''}
                </Paragraph>
              </AbsoluteVStack>
            </>
          }
          photo={
            <VStack>
              {/* <AbsoluteVStack
                fullscreen
                perspective={1000}
                rotateY="-15deg"
                backgroundColor={backgroundColor}
                zIndex={10}
              ></AbsoluteVStack> */}

              <HStack
                overflow="hidden"
                borderRadius={cardFrameBorderRadius}
                opacity={0.7}
                position="absolute"
                fullscreen
                flexWrap="wrap"
              >
                {photos.slice(0, 2).map((photo, index) => {
                  const uri = getImageUrl(photo ?? '', cardFrameWidth, cardFrameHeight)
                  if (!uri) {
                    return null
                  }
                  return (
                    <VStack
                      key={index}
                      zIndex={100 - index}
                      borderRadius={1000}
                      overflow="hidden"
                      y={-40}
                      x={-40}
                      scale={0.8}
                      {...(index > 0 && {
                        x: 60,
                        y: -180,
                        scale: 0.65,
                      })}
                    >
                      <Image
                        style={{
                          width: cardFrameWidth,
                          height: cardFrameWidth,
                          borderRadius: 1000,
                        }}
                        source={{ uri }}
                      />
                    </VStack>
                  )
                })}
              </HStack>

              {/* <CardOverlay /> */}

              {/* <AbsoluteVStack padding={10} fullscreen>
                <VStack flex={1} maxHeight={cardFrameHeight}>
                  <VStack height={40} width={20} />
                  <Text textAlign="right" fontWeight="300" color="#000">
                    by {list.user?.name ?? list.user?.username ?? ''}
                  </Text>
                  {list.restaurants({ limit: 5 }).map((r, index) => {
                    return (
                      <HStack padding={10} key={index}>
                        <Text color="#000" fontSize={18} fontWeight="600">
                          {index + 1}. {r.restaurant.name}
                        </Text>
                      </HStack>
                    )
                  })}
                </VStack>
              </AbsoluteVStack> */}
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
