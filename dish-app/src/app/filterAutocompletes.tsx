import { isPresent } from '@dish/helpers'
import { uniqBy } from 'lodash'

import { AutocompleteItemFull } from '../helpers/createAutocomplete'
import { fuzzySearch } from '../helpers/fuzzySearch'

export async function filterAutocompletes(query: string, results: AutocompleteItemFull[]) {
  let matched: AutocompleteItemFull[] = []
  if (results.length) {
    matched = await fuzzySearch({
      items: results,
      query,
      keys: ['name', 'description'],
    })
  }
  return uniqBy([...matched, ...results].filter(isPresent), (x) => x.id)
}
