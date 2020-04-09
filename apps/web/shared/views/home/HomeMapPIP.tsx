import _ from 'lodash'
import React, { memo, useEffect, useMemo, useState } from 'react'

import { searchBarHeight } from '../../constants'
import { useDebounceValue } from '../../hooks/useDebounce'
import { useDebounceEffect } from '../../hooks/useDebounceEffect'
import { LngLat, setMapView } from '../../state/home'
import { useOvermind } from '../../state/om'
import { Map, useMap } from '../map'
// import { mapkit } from '../mapkit'
import { ZStack } from '../shared/Stacks'
import { centerMapToRegion } from './HomeMap'
import { getRankingColor, getRestaurantRating } from './RatingView'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

export const HomeMapPIP = memo(() => {
  const om = useOvermind()
  const state = om.state.home.currentState
  const { center, span } = state
  const { map, mapProps } = useMap({
    showsZoomControl: false,
    showsMapTypeControl: false,
    isZoomEnabled: true,
    isScrollEnabled: true,
    showsCompass: mapkit.FeatureVisibility.Hidden,
  })

  const enabled = state.type === 'restaurant' && state.span.lat < 0.02
  const restaurant =
    state.type === 'restaurant'
      ? om.state.home.allRestaurants[state.restaurantId]
      : null
  const coordinate = useMemo(
    () =>
      restaurant &&
      new mapkit.Coordinate(
        restaurant.location.coordinates[1],
        restaurant.location.coordinates[0]
      ),
    [restaurant]
  )
  const annotation = useMemo(() => {
    if (!coordinate || !restaurant) return null
    const percent = getRestaurantRating(restaurant)
    const color = getRankingColor(percent)
    return new mapkit.MarkerAnnotation(coordinate, {
      color,
    })
  }, [coordinate])

  useEffect(() => {
    if (!map) return
    centerMapToRegion({
      map,
      center,
      span: {
        lat: Math.max(span.lat + 0.02, 0.035),
        lng: Math.max(span.lng + 0.02, 0.035),
      },
    })
  }, [map, center, span])

  useEffect(() => {
    if (!map || !annotation) return
    map.addAnnotation(annotation)
    return () => {
      map.removeAnnotation(annotation)
    }
  }, [map, annotation])

  return (
    <ZStack
      position="absolute"
      bottom={30}
      right={30}
      zIndex={1000}
      width="20%"
      height="20%"
      maxWidth={175}
      maxHeight={100}
      borderRadius={20}
      overflow="hidden"
      shadowColor="rgba(0,0,0,0.25)"
      shadowRadius={14}
      shadowOffset={{ height: 3, width: 0 }}
      disabled={!enabled}
      className="ease-in-out-slow"
      {...(!enabled && {
        opacity: 0,
        transform: [{ translateY: 10 }],
      })}
    >
      <ZStack fullscreen bottom={-30} top={-30}>
        <Map {...mapProps} />
      </ZStack>
    </ZStack>
  )
})
