import { graphql } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import React, { Suspense } from 'react'
import { Hoverable, VStack } from 'snackui'

import { selectTagDishViewSimple } from '../../../helpers/selectDishViewSimple'
import { FeedCard, FeedCardProps } from '../../home/FeedCard'
import { getListPhoto } from '../../home/getListPhoto'
import { ListFavoriteButton } from '../../home/restaurant/ListFavoriteButton'
import { Link } from '../Link'
import { useList } from './useList'

export type ListCardProps = ListIDProps &
  FeedCardProps & {
    numItems?: number
    onHover?: (is: boolean) => any
    floating?: boolean
  }

export type ListIDProps = {
  slug: string
  userSlug: string
}

export const ListCard = graphql((props: ListCardProps) => {
  const { list } = useList(props)
  return (
    <ListCardFrame
      {...props}
      title={list?.name}
      tags={
        props.size === 'xs'
          ? []
          : list
              ?.tags({ limit: 2 })
              .map((x) => (x.tag ? selectTagDishViewSimple(x.tag) : null))
              .filter(isPresent)
      }
      photo={getListPhoto(list)}
    />
  )
})

export const ListCardFrame = graphql((props: ListCardProps) => {
  const { slug, userSlug, onHover, ...feedCardProps } = props

  const contents = (
    <Link
      asyncClick
      {...(!!(slug && userSlug) && {
        name: 'list',
        params: { slug, userSlug },
      })}
    >
      <FeedCard pressable flat chromeless floating {...feedCardProps}>
        {!props.size?.endsWith('xs') && (
          <VStack x={-5}>
            <Suspense fallback={null}>
              <ListFavoriteButton slug={props.slug} />
            </Suspense>
          </VStack>
        )}
      </FeedCard>
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
})
