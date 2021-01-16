import { deleteAllFuzzyBy } from './queryHelpers'

export async function flushTestData() {
  console.log('flushing test data...')
  await deleteAllFuzzyBy('review', 'text', 'test')
  await deleteAllFuzzyBy('tag', 'name', 'test')
  await deleteAllFuzzyBy('user', 'username', 'test')
  await deleteAllFuzzyBy('menu_item', 'name', 'Test')
  await deleteAllFuzzyBy('restaurant', 'name', 'Test')
  await deleteAllFuzzyBy('photo', 'url', 'imgur.com')
  console.log('done flushing...')
}
