import { Dish } from './Dish'
import { Review } from './Review'
import { Scrape } from './Scrape'
import { User } from './User'

export async function flushTestData() {
  await Scrape.deleteAllFuzzyBy('id_from_source', 'test')
  await Review.deleteAllFuzzyBy('text', 'test')
  // await Tag.deleteAllFuzzyBy('name', 'test')
  await User.deleteAllFuzzyBy('username', 'test')
  await Dish.deleteAllFuzzyBy('name', 'Test')
  // await Restaurant.deleteAllFuzzyBy('name', 'Test')
}
