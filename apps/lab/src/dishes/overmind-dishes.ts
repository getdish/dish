import { ModelBase } from '@dish/models'

interface Continent {
  id: number
  name: string
  icon: string
}

interface Country {
  name: string
  icon: string
  continentId: number
}

interface Dish {
  name: string
  alternates?: string[]
  countryId: number
}

type LabDishesState = {
  continents: Continent[]
  countries: Country[]
  dishes: { [id: number]: Dish }
}

export async function onInitialize() {
  const query = {
    query: {
      taxonomy: {
        __args: {
          where: {
            // location: {
            //   _st_d_within: {
            //     distance: distance,
            //     from: {
            //       type: 'Point',
            //       coordinates: [lng, lat],
            //     },
            //   },
            // },
          },
        },
      },
    },
  }
  const response = await ModelBase.hasura(query)
  debugger
}

export const state: LabDishesState = {
  continents: [],
  countries: [],
  dishes: {},
}

export const actions = {
  // createContinent,
}
