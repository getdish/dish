import { LngLatBounds, Popup } from 'mapbox-gl'

export type MapState = {
 center: [number, number],
 zoom: [number],
 bounds: LngLatBounds,
}

export type MarkerPinConstructor<T> = {
 new (markerPin: MarkerPin<T>);
}

export type MarkerPin<T> = {
 markerPin: T
}