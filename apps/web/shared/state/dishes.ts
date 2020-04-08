import { Tag } from '@dish/models'
import { Action } from 'overmind'

type LabDishesState = {
  tag: Tag[]
}

export const state: LabDishesState = {
  tag: [],
}

const setTaxonomies: Action<Tag[]> = (om, next) => {
  om.state.dishes.tag = next
}

export const actions = {
  setTaxonomies,
}
