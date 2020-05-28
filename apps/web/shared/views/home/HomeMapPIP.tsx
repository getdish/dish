import { ZStack, useOnMount } from '@dish/ui'
import _ from 'lodash'
import React, { memo, useEffect, useMemo, useState } from 'react'

import { useOvermind } from '../../state/useOvermind'
import { Map, useMap } from '../map'
import { centerMapToRegion, onMapLoadedCallback } from './HomeMap'
import { getRankingColor, getRestaurantRating } from './RestaurantRatingView'

export const HomeMapPIP = memo(() => {
  const [isLoaded, setIsLoaded] = useState(false)

  useOnMount(() => {
    onMapLoadedCallback(() => {
      setIsLoaded(true)
    })
  })

  if (!isLoaded) {
    return null
  }

  return <HomeMapPIPContent />
})

function HomeMapPIPContent() {
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

  const enabled = state.type === 'restaurant' && span.lat < 0.02
  const restaurant =
    state.type === 'restaurant'
      ? om.state.home.allRestaurants[state.restaurantId]
      : null

  const coordinates = restaurant?.location?.coordinates
  const coordinate = useMemo(
    () =>
      coordinates &&
      new window.mapkit.Coordinate(coordinates[1], coordinates[0]),
    coordinates
  )
  const annotation = useMemo(() => {
    if (!coordinate || !restaurant) return null
    const percent = getRestaurantRating(restaurant.rating)
    const color = getRankingColor(percent)
    return new window.mapkit.MarkerAnnotation(coordinate, {
      color,
    })
  }, [coordinate])

  useEffect(() => {
    if (!map) return
    centerMapToRegion({
      map,
      center,
      span: {
        lat: Math.max(span.lat * 2.5, 0.035),
        lng: Math.max(span.lng * 2.5, 0.035),
      },
    })
  }, [map, center, span])

  useEffect(() => {
    if (!map || !annotation) return
    map.addAnnotation(annotation)
    return () => {
      try {
        map.removeAnnotation(annotation)
      } catch (err) {
        console.error(err)
      }
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
      maxHeight={150}
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
}
