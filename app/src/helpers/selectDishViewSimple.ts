import { restaurant, restaurant_tag, tag } from '@dish/graph'

import { RGB } from './rgb'

export type DishTagItemSimple = {
  id: string
  name: string
  icon?: string
  score?: number
  rating?: number
  image?: string
  slug: string
  isFallback?: boolean
  type: string
  rank?: number
  rgb?: RGB | null
  restaurant?: restaurant
}

export const selectRishDishViewSimple = (tag: restaurant_tag): DishTagItemSimple => {
  const tagImage = tag.photos?.[0]
  const tagFallbackImage = tag.tag?.default_image
  const rawRating = tag.rating ? tag.rating * 100 : null
  const totalVotes = tag.upvotes + tag.downvotes
  const ratioRating = totalVotes > 0 ? (tag.upvotes / totalVotes) * 100 : 0
  const rating = Math.round((rawRating ?? ratioRating) / 10)
  return {
    restaurant: tag.restaurant,
    id: tag.tag?.id,
    name: tag.tag?.name || '',
    icon: tag.tag?.icon || '',
    slug: tag.tag?.slug || '',
    score: rating,
    rating,
    image: tagImage || tagFallbackImage,
    isFallback: !tagImage,
    type: tag.tag.type || '',
    rank: tag.rank || undefined,
    rgb: tag.tag.rgb,
  }
}

export const selectTagDishViewSimple = (tag: tag): DishTagItemSimple => {
  const [tagImage, tagFallbackImage] = tag.default_images ?? []
  return {
    id: tag.id,
    type: tag.type || '',
    name: tag.name || '',
    icon: tag.icon || '',
    slug: tag.slug || '',
    image: tagImage || tagFallbackImage,
    isFallback: !tagImage,
    rgb: tag.rgb,
  }
}
