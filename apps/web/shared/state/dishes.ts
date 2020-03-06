import { Taxonomy } from '@dish/models'
import { Action } from 'overmind'

type LabDishesState = {
  taxonomy: Taxonomy[]
}

export const state: LabDishesState = {
  taxonomy: [],
}

const setTaxonomies: Action<Taxonomy[]> = (om, next) => {
  om.state.dishes.taxonomy = next
}

export const actions = {
  setTaxonomies,
}
