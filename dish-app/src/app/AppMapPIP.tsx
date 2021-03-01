import { LngLat, graphql, restaurant } from '@dish/graph'
import { useStoreInstance } from '@dish/use-store'
import { isEqual } from 'lodash'
import mapboxgl from 'mapbox-gl'
import React, { Suspense, memo, useEffect, useRef } from 'react'
import { AbsoluteVStack, VStack, getMedia, useMedia } from 'snackui'

import { MAPBOX_ACCESS_TOKEN } from '../constants/constants'
import {
  defaultCenter,
  defaultLocationAutocompleteResults,
} from '../constants/defaultLocationAutocompleteResults'
import { queryRestaurant } from '../queries/queryRestaurant'
import { appMapStore, useAppMap } from './AppMapStore'
import { drawerStore } from './drawerStore'
import { useHomeStore } from './homeStore'
import { mapStyles } from './mapStyles'

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

export default memo(() => {
  const media = useMedia()
  const drawer = useStoreInstance(drawerStore)

  if (!media.xs) {
    return null
  }

  const isHidden = media.xs && drawer.snapIndex > 0

  return (
    <Suspense fallback={null}>
      <VStack
        className="ease-in-out"
        transform={[{ scale: 0.8 }, { translateX: 15 }, { translateY: 15 }]}
        {...(isHidden && {
          opacity: 0,
          pointerEvents: 'none',
        })}
      >
        <AppPIPContent />
      </VStack>
    </Suspense>
  )
})

const AppPIPContent = graphql(() => {
  const home = useHomeStore()
  const position = useAppMap('position')
  const mapNode = useRef<HTMLDivElement>(null)
  const state = home.currentState
  const appMap = useStoreInstance(appMapStore)
  const focusedRestaurant = appMap.hovered ?? appMap.selected

  let restaurants: restaurant[] | null = null
  let slug: string | null = null
  let span: LngLat = position.span

  if (state.type === 'restaurant') {
    slug = state.restaurantSlug
    restaurants = [queryRestaurant(slug)[0]]
    // zoom out on pip for restaurant
    span = {
      lat: span.lat * 2.5,
      lng: span.lng * 2.5,
    }
  } else if (focusedRestaurant) {
    slug = focusedRestaurant.slug ?? ''
    // @ts-ignore
    restaurants = [queryRestaurant(slug)[0]]
    // zoom in on pip for search
    span = {
      lat: 0.005,
      lng: 0.005,
    }
  }

  const restaurant = restaurants?.[0]
  const curCenter = appMap.position.center
  const restCenter = restaurant?.location?.coordinates as LngLat | null
  const center = restCenter || curCenter || defaultCenter

  const pipAction = (() => {
    if (getMedia().xs && drawerStore.snapIndex === 0) {
      // move drawer down
      return () => {
        drawerStore.setSnapIndex(2)
      }
    }
    if (center[0] && !isEqual(center, appMapStore.position.center)) {
      return () => {
        appMapStore.setPosition({
          center: center,
          span: pipSpan(span),
        })
      }
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
    if (!mapNode.current) {
      return
    }
    new mapboxgl.Map({
      container: mapNode.current,
      style: mapStyles.light,
      center,
      zoom: 11,
      attributionControl: false,
    }).addControl(
      new mapboxgl.AttributionControl({
        compact: true,
      })
    )
  }, [mapNode.current])

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
      width={70}
      height={70}
      borderRadius={200}
      // keeps spacing when wrapped
      marginTop={10}
      overflow="hidden"
      shadowColor="rgba(0,0,0,0.2)"
      shadowRadius={18}
      shadowOffset={{ height: 3, width: 0 }}
      className="12313333333 ease-in-out-slow"
      transform={[{ scale: 1 }]}
      cursor="pointer"
      pressStyle={{
        transform: [{ scale: 0.9 }],
      }}
      hoverStyle={{
        transform: [{ scale: 1.1 }],
      }}
      {...(!pipAction && {
        pointerEvents: 'none',
        opacity: 0,
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
