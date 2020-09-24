import { getTagId } from './getTagId'
import { AutocompleteItem } from './home-types'

export function createAutocomplete(
  item: Partial<AutocompleteItem>
): AutocompleteItem {
  const next = {
    name: '',
    type: 'dish',
    ...item,
  }
  return {
    is: 'autocomplete',
    ...next,
    tagId: getTagId(next),
  }
}
