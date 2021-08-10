import { graphql } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import React from 'react'
import { Hoverable } from 'snackui'

import { selectTagDishViewSimple } from '../../../helpers/selectDishViewSimple'
import { FeedCard, FeedCardProps } from '../../home/FeedCard'
import { getListPhoto } from '../../home/getListPhoto'
import { FavoriteButton } from '../FavoriteButton'
import { Link } from '../Link'
import { useList, useListFavorite } from './useList'

export type ListIDProps = {
  slug?: string
  userSlug?: string
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
    props: ListIDProps &
      FeedCardProps & {
        onHover?: (is: boolean) => any
        floating?: boolean
      }
  ) => {
    const { slug, userSlug, onHover, ...feedCardProps } = props
    const { list } = useList(props)

    if (!slug || !userSlug) {
      return <FeedCard title="" size="sm" {...feedCardProps} />
    }

    // <Suspense fallback={null}>
    //   <ListFavoriteButton {...props} />
    // </Suspense>

    const contents = (
      <Link name="list" asyncClick params={{ slug, userSlug }}>
        <FeedCard
          variant="flat"
          chromeless
          floating
          title={list.name}
          tags={list
            .tags({ limit: 2 })
            .map((x) => (x.tag ? selectTagDishViewSimple(x.tag) : null))
            .filter(isPresent)}
          photo={getListPhoto(list)}
          emphasizeTag
          {...feedCardProps}
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
