import { LngLat, Restaurant, graphql } from '@dish/graph'
import { AbsoluteVStack, VStack } from '@dish/ui'
import { useStore } from '@dish/use-store'
import { isEqual } from 'lodash'
import mapboxgl from 'mapbox-gl'
import React, { Suspense, memo, useEffect, useRef, useState } from 'react'

import { MAPBOX_ACCESS_TOKEN } from '../../constants'
import { useOvermind } from '../../state/om'
import { BottomDrawerStore } from './HomeSmallDrawer'
import { getZoomLevel, mapZoomToMedium } from './mapHelpers'
import {
  useMediaQueryIsReallySmall,
  useMediaQueryIsSmall,
} from './useMediaQueryIs'
import { restaurantQuery } from './useRestaurantQuery'

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

export default memo(() => {
  const isSmall = useMediaQueryIsSmall()
  const isReallySmall = useMediaQueryIsReallySmall()
  const om = useOvermind()
  const drawerSnapPoint = om.state.home.drawerSnapPoint

  if (!isReallySmall) {
    return null
  }

  return (
    <Suspense fallback={null}>
      <VStack
        className="ease-in-out"
        transform={[
          { scale: isSmall ? 0.8 : 1 },
          { translateX: isSmall ? 15 : 0 },
          { translateY: isSmall ? 15 : 0 },
        ]}
        {...(isReallySmall &&
          drawerSnapPoint > 0 && {
            opacity: 0,
            pointerEvents: 'none',
          })}
      >
        <HomeMapPIPContent isSmall={isReallySmall} />
      </VStack>
    </Suspense>
  )
})

const HomeMapPIPContent = graphql(({ isSmall }: { isSmall: boolean }) => {
  const om = useOvermind()
  const mapNode = useRef<HTMLDivElement>(null)
  const state = om.state.home.currentState
  const drawerStore = useStore(BottomDrawerStore)
  const focusedRestaurant =
    om.state.home.hoveredRestaurant ?? om.state.home.selectedRestaurant

  let restaurants: Restaurant[] | null = null
  let slug: string | null = null
  let span: LngLat = state.span

  if (state.type === 'restaurant') {
    slug = state.restaurantSlug
    restaurants = restaurantQuery(slug)
    // zoom out on pip for restaurant
    span = {
      lat: span.lat * 2.5,
      lng: span.lng * 2.5,
    }
  } else if (focusedRestaurant) {
    slug = focusedRestaurant.slug
    restaurants = restaurantQuery(slug)
    // zoom in on pip for search
    span = {
      lat: 0.005,
      lng: 0.005,
    }
  }

  const restaurant = restaurants?.[0]
  const curCenter = om.state.home.currentState.center

  const coords = restaurant?.location?.coordinates ?? [
    curCenter?.lng ?? 0,
    curCenter?.lat ?? 0,
  ]
  const center: LngLat = {
    lat: coords[1] ?? 0.1,
    lng: coords[0] ?? 0.1,
  }

  const pipAction = (() => {
    if (isSmall && drawerStore.snapIndex === 0) {
      // move drawer down
      return () => {
        drawerStore.setSnapPoint(2)
      }
    }
    if (coords[0] && !isEqual(center, om.state.home.currentState.center)) {
      return () => {
        om.actions.home.updateCurrentState({
          center: center,
          span: pipSpan(span),
        })
      }
    } else if (getZoomLevel(span) !== 'medium') {
      return mapZoomToMedium
    } else {
      // none
    }
  })()

  // const coordinate = useMemo(
  //   () => coords && new mapkit.Coordinate(coords[1], coords[0]),
  //   [JSON.stringify(coords)]
  // )
  // const annotation = useMemo(() => {
  //   if (!coordinate || !restaurant) return null
  //   const percent = getRestaurantRating(restaurant.rating)
  //   const color = getRankingColor(percent)
  //   return new mapkit.MarkerAnnotation(coordinate, {
  //     color,
  //   })
  // }, [coordinate])

  const pipSpan = (span: LngLat) => {
    return {
      lat: Math.max(span.lat, 0.005),
      lng: Math.max(span.lng, 0.005),
    }
  }

  useEffect(() => {
    new mapboxgl.Map({
      container: mapNode.current,
      style: 'mapbox://styles/nwienert/ckddrrcg14e4y1ipj0l4kf1xy',
      center,
      zoom: 11,
      attributionControl: false,
    }).addControl(
      new mapboxgl.AttributionControl({
        compact: true,
      })
    )
  }, [])

  // useEffect(() => {
  //   if (!map) return
  //   centerMapToRegion({
  //     animated: false,
  //     map,
  //     center,
  //     span: pipSpan(span),
  //   })
  // }, [map, center, span])

  // useEffect(() => {
  //   if (!map || !annotation) return
  //   try {
  //     map.addAnnotation(annotation)
  //   } catch (err) {
  //     console.warn(err.message)
  //   }
  //   return () => {
  //     try {
  //       map.removeAnnotation(annotation)
  //     } catch (err) {
  //       console.warn(err.message)
  //     }
  //   }
  // }, [map, annotation])

  return (
    <VStack
      pointerEvents="auto"
      width={120}
      height={100}
      borderRadius={20}
      // keeps spacing when wrapped
      marginTop={10}
      overflow="hidden"
      shadowColor="rgba(0,0,0,0.2)"
      shadowRadius={18}
      shadowOffset={{ height: 3, width: 0 }}
      className="ease-in-out-slow"
      transform={[{ scale: 1 }]}
      cursor="pointer"
      pressStyle={{
        transform: [{ scale: 0.9 }],
      }}
      hoverStyle={{
        transform: [{ scale: 1.1 }],
      }}
      {...(!pipAction && {
        display: 'none',
      })}
      onPress={pipAction}
    >
      <AbsoluteVStack pointerEvents="none" fullscreen bottom={-30} top={-15}>
        <div
          ref={mapNode}
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            background: '#eee',
          }}
        />
      </AbsoluteVStack>
    </VStack>
  )
})
