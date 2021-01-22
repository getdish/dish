export const getTagSlug = (tag: { slug?: string | null }) => {
  if (!tag || tag.slug === null) {
    console.warn('no tag, or tag slug', tag)
    return ''
  }
  return tag.slug ?? ''
}
