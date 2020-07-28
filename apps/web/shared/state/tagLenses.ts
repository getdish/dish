import { Tag } from '@dish/graph'

export const tagLenses: Tag[] = [
  {
    id: '3',
    name: 'Gems',
    icon: ' 💎',
    rgb: [90, 30, 205],
    type: 'lense',
  },
  {
    id: '6',
    name: 'Vibe',
    icon: '🌃',
    rgb: [190, 112, 58],
    type: 'lense',
  },
  {
    id: '5',
    name: 'Drink',
    icon: '🍷',
    rgb: pctTo255([0.6, 0.3, 0.3]),
    type: 'lense',
  },
  {
    id: '9',
    name: 'Veg',
    icon: '🥬',
    rgb: pctTo255([0.2, 0.6, 0.2]),
    type: 'lense',
  },
]

function pctTo255(x: number[]) {
  return x.map((x) => x * 255) as typeof x
}
