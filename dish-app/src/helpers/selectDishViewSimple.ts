import { restaurant_tag, tag } from '@dish/graph'

export type DishTagItemSimple = {
  id: string
  name: string
  icon?: string
  score?: number
  rating?: number
  votesRatio?: number
  upvotes?: number
  downvotes?: number
  image: string
  slug: string
  isFallback?: boolean
  type: string
}

export const selectRishDishViewSimple = (
  tag: restaurant_tag
): DishTagItemSimple => {
  const tagImage = tag.photos()?.[0]
  const tagFallbackImage = tagImage ? null : tag.tag?.default_images()?.[0]
  return {
    id: tag.tag?.id,
    name: tag.tag?.name ?? '',
    icon: tag.tag?.icon ?? '',
    slug: tag.tag?.slug ?? '',
    score: tag.score ?? 0,
    rating: tag.rating ?? 0,
    votesRatio: tag.votes_ratio ?? 0,
    upvotes: tag.upvotes,
    downvotes: tag.downvotes,
    image: tagImage ?? tagFallbackImage,
    isFallback: !tagImage,
    type: tag.tag.type ?? '',
  }
}

export const selectTagDishViewSimple = (tag: tag) => {
  const [tagImage, tagFallbackImage] = tag.default_images?.() ?? []
  return {
    id: tag.id,
    name: tag.name ?? '',
    icon: tag.icon ?? '',
    slug: tag.slug ?? '',
    image: tagImage ?? tagFallbackImage,
    isFallback: !tagImage,
  }
}
