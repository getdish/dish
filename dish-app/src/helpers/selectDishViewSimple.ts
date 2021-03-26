import { restaurant_tag, tag } from '@dish/graph'

export type DishTagItemSimple = {
  id: string
  name: string
  icon?: string
  score?: number
  rating?: number
  image: string
  slug: string
  isFallback?: boolean
  type: string
  rank?: number
}

export const selectRishDishViewSimple = (tag: restaurant_tag): DishTagItemSimple => {
  const tagImage = tag.photos?.[0]
  const tagFallbackImage = tagImage ? null : tag.tag?.default_images?.[0]
  const rawRating = tag.rating ? tag.rating * 100 : null
  const totalVotes = tag.upvotes + tag.downvotes
  const ratioRating = totalVotes > 0 ? (tag.upvotes / totalVotes) * 100 : 0
  const rating = Math.round((rawRating ?? ratioRating) / 10)
  return {
    id: tag.tag?.id,
    name: tag.tag?.name || '',
    icon: tag.tag?.icon || '',
    slug: tag.tag?.slug || '',
    score: (tag.upvotes || 0) - Math.abs(tag.downvotes || 0),
    rating,
    image: tagImage || tagFallbackImage,
    isFallback: !tagImage,
    type: tag.tag.type || '',
    rank: tag.rank || undefined,
  }
}

export const selectTagDishViewSimple = (tag: tag) => {
  const [tagImage, tagFallbackImage] = tag.default_images ?? []
  return {
    id: tag.id,
    name: tag.name || '',
    icon: tag.icon || '',
    slug: tag.slug || '',
    image: tagImage || tagFallbackImage,
    isFallback: !tagImage,
  }
}
