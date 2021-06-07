import { TILES_HOST_INTERNAL } from '@dish/graph'

export const tilesHost = `http://${TILES_HOST_INTERNAL}`
export const host =
  process.env.NODE_ENV === 'development' ? 'http://d1sh.com' : 'https://dishapp.com'
export const tilesPublicHost = `${host}${process.env.MARTIN_API_PATH || '/api/tile'}`
