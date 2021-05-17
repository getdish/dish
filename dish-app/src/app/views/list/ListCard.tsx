import { graphql } from '@dish/graph'
import React from 'react'
import { AbsoluteVStack, HStack, Hoverable, VStack } from 'snackui'

import { getImageUrl } from '../../../helpers/getImageUrl'
import { Card } from '../../home/restaurant/Card'
import { FavoriteButton, FavoriteButtonProps } from '../FavoriteButton'
import { Image } from '../Image'
import { Link } from '../Link'
import { Score } from '../Score'
import { useList } from './useList'

export type ListIDProps = {
  slug?: string
  userSlug?: string
  region: string
}

export const ListCard = graphql(
  (
    props: ListIDProps & {
      onHover?: (is: boolean) => any
      hoverable?: boolean
      isBehind?: boolean
    }
  ) => {
    const { slug, userSlug, region, onHover, hoverable, isBehind } = props
    const { list, isFavorited, reviewsCount, toggleFavorite, photos, backgroundColor } = useList(
      props
    )

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
            <AbsoluteVStack zIndex={1000000} bottom="-5%" right="-5%">
              <FavoriteButton isFavorite={isFavorited} onToggle={toggleFavorite}>
                {reviewsCount}
              </FavoriteButton>
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
