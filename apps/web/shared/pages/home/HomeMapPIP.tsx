import { LngLat, RestaurantQuery, graphql } from '@dish/graph'
import { AbsoluteVStack, useOnMount } from '@dish/ui'
import React, { Suspense, memo, useEffect, useMemo, useState } from 'react'

import { useOvermind } from '../../state/useOvermind'
import { Map, useMap } from '../../views/map'
import { centerMapToRegion } from './centerMapToRegion'
import { getRankingColor, getRestaurantRating } from './getRestaurantRating'
import { onMapLoadedCallback } from './onMapLoadedCallback'
import { useMediaQueryIsSmall } from './useMediaQueryIs'
import { useRestaurantQuery } from './useRestaurantQuery'

export const HomeMapPIP = memo(() => {
  const isSmall = useMediaQueryIsSmall()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    return onMapLoadedCallback(() => {
      setIsLoaded(true)
    })
  }, [])

  if (!isLoaded || isSmall) {
    return null
  }

  return (
    <Suspense fallback={null}>
      <HomeMapPIPContent />
    </Suspense>
  )
})

const HomeMapPIPContent = graphql(() => {
  const om = useOvermind()
  const state = om.state.home.currentState
  const { map, mapProps } = useMap({
    // @ts-ignore
    showsZoomControl: false,
    showsMapTypeControl: false,
    isZoomEnabled: true,
    isScrollEnabled: true,
    showsCompass: mapkit.FeatureVisibility.Hidden,
  })

  const hoveredRestuarant = om.state.home.hoveredRestaurant

  let restaurant: RestaurantQuery | null = null
  let span: LngLat = state.span

  if (state.type === 'restaurant') {
    restaurant = useRestaurantQuery(state.restaurantSlug)
    // zoom out on pip for restaurant
    span = {
      lat: span.lat * 2.5,
      lng: span.lng * 2.5,
    }
  } else if (hoveredRestuarant) {
    restaurant = useRestaurantQuery(hoveredRestuarant.slug)
    // zoom in on pip for search
    span = {
      lat: 0.005,
      lng: 0.005,
    }
  }

  const enabled = hoveredRestuarant
    ? hoveredRestuarant
    : state.type === 'restaurant'

  const coordinates = restaurant?.location?.coordinates
  const center: LngLat = coordinates
    ? {
        lat: coordinates[1],
        lng: coordinates[0],
      }
    : state.center

  const coordinate = useMemo(
    () => coordinates && new mapkit.Coordinate(coordinates[1], coordinates[0]),
    [JSON.stringify(coordinates)]
  )
  const annotation = useMemo(() => {
    if (!coordinate || !restaurant) return null
    const percent = getRestaurantRating(restaurant.rating)
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
        lat: Math.max(span.lat, 0.005),
        lng: Math.max(span.lng, 0.005),
      },
    })
  }, [map, center, span])

  useEffect(() => {
    if (!map || !annotation) return
    try {
      map.addAnnotation(annotation)
    } catch (err) {
      console.warn(err.message)
    }
    return () => {
      try {
        map.removeAnnotation(annotation)
      } catch (err) {
        console.warn(err.message)
      }
    }
  }, [map, annotation])

  return (
    <AbsoluteVStack
      pointerEvents="none"
      transform={[{ scale: 0.8 }]}
      position="absolute"
      bottom={15}
      right={8}
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
      className="ease-in-out-slow"
      disabled={!enabled}
      {...(!enabled && {
        opacity: 0,
        transform: [{ translateY: 10 }],
      })}
    >
      <AbsoluteVStack fullscreen bottom={-30} top={-30}>
        <Map {...mapProps} />
      </AbsoluteVStack>
    </AbsoluteVStack>
  )
})
