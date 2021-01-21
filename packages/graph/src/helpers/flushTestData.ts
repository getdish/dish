import { globalTagId } from '../constants'
import { tagInsert } from '../queries/tagQueries'
import { deleteAllFuzzyBy } from './queryHelpers'

export async function flushTestData() {
  await deleteAllFuzzyBy('review', 'text', 'test')
  await deleteAllFuzzyBy('tag', 'name', 'test')
  await deleteAllFuzzyBy('user', 'username', 'test')
  await deleteAllFuzzyBy('menu_item', 'name', 'Test')
  await deleteAllFuzzyBy('restaurant', 'name', 'Test')
  await deleteAllFuzzyBy('photo', 'url', 'imgur.com')
  // ensure parent tag there
  // await tagInsert([
  //   {
  //     id: globalTagId,
  //     name: 'Parent test tag',
  //   },
  // ])
}
