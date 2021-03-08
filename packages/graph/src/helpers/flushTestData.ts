import { deleteAllFuzzyBy } from './queryHelpers'

export async function flushTestData() {
  // safeguard against deleting a bunch of prod data (runs super slow against big data)
  let hasCompletedSome = false
  setTimeout(() => {
    if (!hasCompletedSome) {
      console.warn(
        'LONG RUNNING! are you sure you arent running against prod data?'
      )
      process.exit(0)
    }
  }, 8000)

  await deleteAllFuzzyBy('review', 'text', 'test')
  hasCompletedSome = true
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
