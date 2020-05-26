import { deleteAllFuzzyBy } from './queryHelpers'

export async function flushTestData() {
  await Promise.all([
    deleteAllFuzzyBy('scrape', 'id_from_source', 'test'),
    deleteAllFuzzyBy('review', 'text', 'test'),
    deleteAllFuzzyBy('tag', 'name', 'test'),
    deleteAllFuzzyBy('user', 'username', 'test'),
    deleteAllFuzzyBy('dish', 'name', 'Test'),
    deleteAllFuzzyBy('restaurant', 'name', 'Test'),
  ])
}
