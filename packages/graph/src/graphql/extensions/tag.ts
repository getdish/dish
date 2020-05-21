import _ from 'lodash'

import { slugify } from '../../helpers/slugify'

export const tag = (tag) => {
  return {
    getNameWithIcon() {
      let name = tag.name
      if (tag.icon) {
        name = tag.icon + name
      }
      return name
    },
    slug() {
      return slugify(tag.name)
    },
    isOrphan() {
      return tag.parent.id == '00000000-0000-0000-0000-000000000000'
    },
    slugDisambiguated() {
      return `${slugify(tag.parent.name)}__${this.slug()}`
    },
    slugs() {
      let parentage: string[] = []
      if (!this.isOrphan()) {
        parentage = [slugify(tag.parent.name), this.slugDisambiguated()]
      }
      const category_names = (tag.categories || []).map((i) =>
        slugify(i.category.name)
      )
      const all = [this.slug(), ...parentage, ...category_names].flat()
      return _.uniq(all)
    },
    addAlternate(alternate: string) {
      if (alternate != tag.name) {
        tag.alternates = tag.alternates || []
        tag.alternates?.push(alternate)
        tag.alternates = _.uniq(tag.alternates)
      }
    },
  }
}
