export const getTagSlug = (slug?: string | null) => {
  if (!slug) {
    console.warn('no tag, or tag slug', slug)
    return ''
  }
  return slug
}
