import { AutocompleteItemLocation, createAutocomplete } from '../helpers/createAutocomplete'

export const defaultCenter = {
  lng: -122.421351,
  lat: 37.759251,
}

export const defaultLocationAutocompleteResults = [
  createAutocomplete<AutocompleteItemLocation>({
    slug: 'new-york',
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
  createAutocomplete<AutocompleteItemLocation>({
    name: 'Los Angeles',
    slug: 'ca-los-angeles',
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
  createAutocomplete<AutocompleteItemLocation>({
    name: 'Las Vegas',
    slug: 'nv-las-vegas',
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
  createAutocomplete<AutocompleteItemLocation>({
    name: 'San Francisco',
    slug: 'ca-san-francisco',
    center: defaultCenter,
    span: {
      lat: 0.15,
      lng: 0.15,
    },
    icon: '📍',
    type: 'place',
  }),
  createAutocomplete<AutocompleteItemLocation>({
    name: 'Miami',
    slug: 'fl-miami',
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
  createAutocomplete<AutocompleteItemLocation>({
    name: 'Chicago',
    slug: 'il-chicago',
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
  createAutocomplete<AutocompleteItemLocation>({
    name: 'New Orleans',
    slug: 'la-new-orleans',
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