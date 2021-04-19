import { HomeStateItemHome, HomeStateItemSearch } from '../../../types/homeTypes'

const coordShort = (coord: number) => `${coord}`.slice(0, 7)

export const urlSerializers = {
  home: {
    region: {
      serialize: ({ region }: HomeStateItemHome) => {
        return region ?? 'ca-san-francisco'
      },
    },
  },
  search: {
    region: {
      match: (param: string) => +param[0] === +param[0] && param.includes('_'),
      serialize: ({ center, span, region }: HomeStateItemSearch) => {
        if (region) {
          return region
        }
        if (center && span) {
          const val = [center.lat, center.lng, span.lat, span.lng].map(coordShort).join('_')
          return val
        }
        return 'ca-san-francisco'
      },
      deserialize: (param: string) => {
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
      },
    },
  },
}
