import { AutocompleteItem } from '../AppAutocomplete'
import { createAutocomplete } from './createAutocomplete'

export const defaultLocationAutocompleteResults: AutocompleteItem[] = [
  createAutocomplete({
    name: 'New York',
    center: {
      lat: 40.7130125,
      lng: -74.0071296,
    },
    icon: '📍',
    type: 'country',
  }),
  createAutocomplete({
    name: 'Los Angeles',
    center: {
      lat: 34.053345,
      lng: -118.242349,
    },
    icon: '📍',
    type: 'country',
  }),
  createAutocomplete({
    name: 'Las Vegas',
    center: {
      lat: 36.1667469,
      lng: -115.1487083,
    },
    icon: '📍',
    type: 'country',
  }),
  createAutocomplete({
    name: 'San Francisco',
    center: {
      lng: -122.421351,
      lat: 37.759251,
    },
    icon: '📍',
    type: 'country',
  }),
  createAutocomplete({
    name: 'Miami',
    center: {
      lat: 25.7279534,
      lng: -80.2340487,
    },
    icon: '📍',
    type: 'country',
  }),
  createAutocomplete({
    name: 'Chicago',
    center: {
      lat: 41.883718,
      lng: -87.632382,
    },
    icon: '📍',
    type: 'country',
  }),
  createAutocomplete({
    name: 'New Orleans',
    center: {
      lat: 29.952535,
      lng: -90.076688,
    },
    icon: '📍',
    type: 'country',
  }),
]
