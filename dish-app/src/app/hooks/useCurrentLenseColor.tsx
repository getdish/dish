import { tagLenses } from '../../constants/localTags'
import { useHomeStore } from '../homeStore'

export const useCurrentLenseColor = (): [number, number, number] => {
  const home = useHomeStore()
  const lense = home.currentStateLense
  return lense?.rgb ?? tagLenses[0].rgb
}
