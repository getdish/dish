import { AutocompleteItem } from './home-types'

export function createAutocomplete(
  item: Partial<AutocompleteItem>
): AutocompleteItem {
  return {
    id: `${Math.random()}`,
    is: 'autocomplete',
    name: '',
    type: 'dish',
    ...item,
    tagId: item.slug,
  }
}
