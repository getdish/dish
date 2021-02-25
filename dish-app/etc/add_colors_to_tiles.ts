import '@dish/helpers/polyfill'

import { mutate, query, resolved } from '@dish/graph'

import { getColorsForName } from '../src/helpers/getColorsForName'

console.log('hasura pass is', process.env.HASURA_SECRET)

async function main() {
  await updateNeighborhoods()
  await updateCounties()
}

async function updateCounties() {
  const tiles = await resolved(() => {
    return query
      .hrr({
        where: {
          slug: {
            _neq: '',
          },
          // color: {
          //   _eq: null,
          // },
        },
      })
      .map((x) => ({ ogc_fid: x.ogc_fid, slug: x.slug }))
  })

  for (const { slug, ogc_fid } of tiles) {
    if (!slug || !ogc_fid) {
      continue
    }
    const colors = getColorsForName(slug)
    if (colors) {
      console.log('setting', slug, colors.pastelColor)
      await mutate((mutation) => {
        const res = mutation.update_hrr_by_pk({
          pk_columns: {
            ogc_fid,
          },
          _set: {
            color: colors.color,
          },
        })
        if (res) {
          return res.__typename
        }
      })
    }
  }
}

async function updateNeighborhoods() {
  const tiles = await resolved(() => {
    return query
      .zcta5({
        where: {
          slug: {
            _neq: '',
          },
          // color: {
          //   _eq: null,
          // },
        },
      })
      .map((x) => ({ ogc_fid: x.ogc_fid, slug: x.slug }))
  })

  console.log('found', tiles.length, tiles[0])
  for (const { slug, ogc_fid } of tiles) {
    if (!slug || !ogc_fid) {
      continue
    }
    const colors = getColorsForName(slug)
    if (colors) {
      await mutate((mutation) => {
        const res = mutation.update_zcta5_by_pk({
          pk_columns: {
            ogc_fid,
          },
          _set: {
            color: colors.color,
          },
        })
        if (res) {
          return res.__typename
        }
      })
    }
  }
}

main()
