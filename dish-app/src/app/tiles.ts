import { green, purple } from '../constants/colors'
import { hexToRGB } from '../helpers/hexToRGB'

export type Tile = {
  name: string
  label: string
  maxZoom: number
  minZoom: number
  labelSource?: string
  promoteId: string
  lineColor?: string
  lineColorActive?: string
  lineColorHover?: string
  color: string
  hoverColor: string
  activeColor: string
}

export const tiles: Tile[] = [
  {
    maxZoom: 20,
    minZoom: 12,
    // lineColor: '#880088',
    // lineColorActive: '#660066',
    // lineColorHover: '#330033',
    label: 'name',
    labelSource: 'public.nhood_labels',
    promoteId: 'ogc_fid',
    activeColor: 'rgba(255, 255, 255, 0)',
    hoverColor: 'rgba(255,255,255,0.35)',
    color: 'rgba(248, 238, 248, 0.5)',
    name: 'public.zcta5',
  },
  // {
  //   maxZoom: 11,
  //   minZoom: 9,
  //   lineColor: '#880088',
  //   promoteId: 'ogc_fid',
  //   activeColor: purple,
  //   hoverColor: 'yellow',
  //   color: lightPurple,
  //   label: 'nhood',
  //   name: 'public.hca',
  // },
  {
    maxZoom: 12,
    minZoom: 4,
    // lineColor: '#aa55aa',
    // lineColorActive: '#660066',
    // lineColorHover: '#330033',
    promoteId: 'ogc_fid',
    activeColor: `rgba(255, 255, 255, 0)`,
    hoverColor: hexToRGB(purple, 0.2).string,
    color: hexToRGB(purple, 0.25).string,
    label: 'hrr_city',
    name: 'public.hrr',
  },
  // {
  //   maxZoom: 4,
  //   minZoom: 0,
  //   // lineColor: '#880088',
  //   // lineColorActive: '#660066',
  //   // lineColorHover: '#330033',
  //   promoteId: 'ogc_fid',
  //   activeColor: green,
  //   hoverColor: 'yellow',
  //   color: purple,
  //   label: null,
  //   name: 'public.state',
  // },
]
