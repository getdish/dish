import { globalTagId } from '../constants'
import { tagUpsert } from '../queries/tagQueries'
import { deleteAllFuzzyBy } from './queryHelpers'

export async function flushTestData() {
  // safeguard against deleting a bunch of prod data (runs super slow against big data)
  let hasCompletedSome = false
  setTimeout(() => {
    if (!hasCompletedSome) {
      console.warn('LONG RUNNING! are you sure you arent running against prod data?')
      process.exit(0)
    }
  }, 8000)

  await deleteAllFuzzyBy('review', 'text', 'test')
  hasCompletedSome = true
  await deleteAllFuzzyBy('tag', 'name', 'test')
  await deleteAllFuzzyBy('user', 'username', 'test')
  await deleteAllFuzzyBy('menu_item', 'name', 'Test')
  await deleteAllFuzzyBy('restaurant', 'name', 'Test')
  await deleteAllFuzzyBy('photo', 'origin', 'imgur.com')
  await deleteAllFuzzyBy('photo', 'url', 'imgur.com')
  await tagUpsert([
    {
      id: globalTagId,
      slug: 'global',
      name: 'Global',
    },
  ])
}
