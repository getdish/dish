import { RestaurantQuery, graphql } from '@dish/graph'
import { AbsoluteVStack, useOnMount } from '@dish/ui'
import React, { Suspense, memo, useEffect, useMemo, useState } from 'react'

import { useOvermind } from '../../state/useOvermind'
import { Map, useMap } from '../../views/map'
import { centerMapToRegion } from './centerMapToRegion'
import { getRankingColor, getRestaurantRating } from './getRestaurantRating'
import { onMapLoadedCallback } from './onMapLoadedCallback'
import { restaurantQuery } from './restaurantQuery'

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

  return (
    <Suspense fallback={null}>
      <HomeMapPIPContent />
    </Suspense>
  )
})

const HomeMapPIPContent = graphql(() => {
  const om = useOvermind()
  const state = om.state.home.currentState
  const { center, span } = state
  const { map, mapProps } = useMap({
    // @ts-ignore
    showsZoomControl: false,
    showsMapTypeControl: false,
    isZoomEnabled: true,
    isScrollEnabled: true,
    showsCompass: mapkit.FeatureVisibility.Hidden,
  })

  const enabled = state.type === 'restaurant' && span.lat < 0.02

  let restaurant: RestaurantQuery | null = null
  if (state.type === 'restaurant') {
    restaurant = restaurantQuery(state.restaurantSlug)
  }

  const coordinates = restaurant?.location?.coordinates
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
    <AbsoluteVStack
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
