import { uniq } from 'lodash'

import {
  tagIsOrphan,
  tagSlug,
  tagSlugDisambiguated,
  tagSlugs,
} from '../../helpers/tag-extension-helpers'

export const tag = (tag) => {
  return {
    getNameWithIcon() {
      let name = tag.name
      if (tag.icon) {
        name = tag.icon + name
      }
      return name
    },
    slug: () => tagSlug(tag),
    slugDisambiguated: () => tagSlugDisambiguated(tag),
    slugs: () => tagSlugs(tag),
    isOrphan: () => tagIsOrphan(tag),
  }
}
