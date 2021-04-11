import { AutocompleteItemFull, createAutocomplete } from '../helpers/createAutocomplete'

export const defaultCenter = {
  lng: -122.421351,
  lat: 37.759251,
}

export const defaultLocationAutocompleteResults: AutocompleteItemFull[] = [
  createAutocomplete({
    name: 'New York',
    center: {
      lat: 40.7130125,
      lng: -74.0071296,
    },
    span: {
      lat: 0.35,
      lng: 0.35,
    },
    icon: '📍',
    type: 'place',
  }),
  createAutocomplete({
    name: 'Los Angeles',
    center: {
      lat: 34.053345,
      lng: -118.242349,
    },
    span: {
      lat: 0.45,
      lng: 0.45,
    },
    icon: '📍',
    type: 'place',
  }),
  createAutocomplete({
    name: 'Las Vegas',
    center: {
      lat: 36.1667469,
      lng: -115.1487083,
    },
    span: {
      lat: 0.2,
      lng: 0.2,
    },
    icon: '📍',
    type: 'place',
  }),
  createAutocomplete({
    name: 'San Francisco',
    center: defaultCenter,
    span: {
      lat: 0.15,
      lng: 0.15,
    },
    icon: '📍',
    type: 'place',
  }),
  createAutocomplete({
    name: 'Miami',
    center: {
      lat: 25.7279534,
      lng: -80.2340487,
    },
    span: {
      lat: 0.5,
      lng: 0.5,
    },
    icon: '📍',
    type: 'place',
  }),
  createAutocomplete({
    name: 'Chicago',
    center: {
      lat: 41.883718,
      lng: -87.632382,
    },
    span: {
      lat: 0.5,
      lng: 0.5,
    },
    icon: '📍',
    type: 'place',
  }),
  createAutocomplete({
    name: 'New Orleans',
    center: {
      lat: 29.952535,
      lng: -90.076688,
    },
    span: {
      lat: 0.3,
      lng: 0.3,
    },
    icon: '📍',
    type: 'place',
  }),
]
