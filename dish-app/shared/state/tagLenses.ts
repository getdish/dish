import { Tag } from '@dish/graph'

export type FullTag = Required<
  Pick<Tag, 'name' | 'id' | 'icon' | 'type' | 'rgb'>
>

export const tagLenses: FullTag[] = [
  {
    id: 'da0e0c85-86b5-4b9e-b372-97e133eccb43',
    name: 'Gems',
    icon: ' 💎',
    rgb: [189, 48, 97],
    type: 'lense',
  },
  {
    id: '5da93fbe-5715-43b4-8b15-6521e3897bd9',
    name: 'Vibe',
    icon: '🌃',
    // #285D97
    rgb: [30, 83, 141],
    type: 'lense',
  },
  {
    id: 'b1580bd8-4f60-45e3-a5a9-c31effe8e7a3',
    name: 'Drink',
    icon: '🍷',
    rgb: pctTo255([0.6, 0.3, 0.3]),
    type: 'lense',
  },
  {
    id: '4768116c-bca3-4936-970b-5f2570a9e8f8',
    name: 'Veg',
    icon: '🥬',
    rgb: pctTo255([0.2, 0.6, 0.2]),
    type: 'lense',
  },
  // {
  //   id: '1',
  //   name: 'Service',
  //   icon: '💁‍♂️',
  //   rgb: pctTo255([0.3, 0.4, 0.3]),
  //   type: 'lense',
  // },
  // {
  //   id: '2',
  //   name: 'Speed',
  //   icon: '🏃‍♀️',
  //   rgb: pctTo255([0.3, 0.4, 0.3]),
  //   type: 'lense',
  // },
  // {
  //   id: '3',
  //   name: 'Authentic',
  //   icon: '🦙',
  //   rgb: pctTo255([0.3, 0.4, 0.3]),
  //   type: 'lense',
  // },
]

function pctTo255(x: number[]) {
  return x.map((x) => x * 255) as typeof x
}

export const tagDescriptions = {
  gems: {
    dish: 'The best 🍔',
    cuisine: 'The Best 🍔 Restaurants',
    plain: 'Uniquely Good',
  },
  vibe: {
    dish: 'Nice 🍔',
    cuisine: 'Vibey 🍔',
    plain: 'Vibes',
  },
  drink: {
    dish: '🍔 & drinks',
    cuisine: '🍔 with a bar',
    plain: 'Good Drinks',
  },
  veg: {
    dish: 'The best Vegetarian 🍔',
    cuisine: 'Vegetarian 🍔 Restaurants',
    plain: 'Vegetarian',
  },
}
