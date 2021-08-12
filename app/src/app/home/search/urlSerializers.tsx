import { MapPosition } from '@dish/graph'

import { HomeStateItemHome, HomeStateItemSearch } from '../../../types/homeTypes'

const coordShort = (coord: number) => `${coord}`.slice(0, 7)

// allows us to remember and retain nice slug names
const knownLocationSlugs: { [key: string]: string } = {}
export function setKnownLocationSlug(slug: string, { span, center }: MapPosition) {
  knownLocationSlugs[urlSerializers.search.region.serialize({ center, span })] = slug
}

export const isLngLatParam = (param: string) => +param[0] === +param[0] && param.includes('_')

const homeSerializer = {
  region: {
    serialize: ({ region }: HomeStateItemHome) => {
      return region ?? 'ca-san-francisco'
    },
  },
}

export const urlSerializers = {
  home: homeSerializer,
  homeRegion: homeSerializer,
  search: {
    region: {
      match: isLngLatParam,
      serialize: ({ center, span, region }: Partial<HomeStateItemSearch>) => {
        if (region) {
          return region
        }
        if (center && span) {
          const key = [center.lat, center.lng, span.lat, span.lng].map(coordShort).join('_')
          return knownLocationSlugs[key] || key
        }
        return 'ca-san-francisco'
      },
      deserialize: (param: string) => {
        if (isLngLatParam(param)) {
          const [latStr, lngStr, spanLatStr, spanLngStr] = param.split('_')
          return {
            center: {
              lat: +latStr,
              lng: +lngStr,
            },
            span: {
              lat: +spanLatStr,
              lng: +spanLngStr,
            },
          }
        } else {
          return param
        }
      },
    },
  },
}
