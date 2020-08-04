import { LngLat, Restaurant, Tag, graphql } from '@dish/graph'
import { AbsoluteVStack, useDebounce, useStateFn } from '@dish/ui'
import { uniqBy } from 'lodash'
import mapboxgl from 'mapbox-gl'
import React, {
  Suspense,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'

import { searchBarHeight, zIndexMap } from '../../constants'
import { getWindowHeight } from '../../helpers/getWindow'
import {
  isHomeState,
  isRestaurantState,
  isSearchState,
} from '../../state/home-helpers'
import { HomeStateItem } from '../../state/home-types'
import { setMapView } from '../../state/mapView'
import { useOvermind } from '../../state/om'
import { Map } from '../../views/Map'
import { getRankingColor, getRestaurantRating } from './getRestaurantRating'
import { snapPoints } from './HomeSmallDrawer'
import { useLastValueWhen } from './useLastValueWhen'
import { useMapSize } from './useMapSize'
import { useMediaQueryIsSmall } from './useMediaQueryIs'
import { useRestaurantQuery } from './useRestaurantQuery'

export default memo(function HomeMap() {
  const [restaurants, setRestaurantsFast] = useState<Restaurant[]>([])
  const [
    restaurantDetail,
    setRestaurantDetailFast,
  ] = useState<Restaurant | null>(null)
  const setRestaurants = useDebounce(setRestaurantsFast, 150)
  const setRestaurantDetail = useDebounce(setRestaurantDetailFast, 150)

  return (
    <>
      <Suspense fallback={null}>
        <HomeMapDataLoader
          onLoadedRestaurants={setRestaurants}
          onLoadedRestaurantDetail={setRestaurantDetail}
        />
      </Suspense>
      <Suspense fallback={null}>
        <HomeMapContent
          restaurantDetail={restaurantDetail}
          restaurants={restaurants}
        />
      </Suspense>
    </>
  )
})

type RestaurantIdentified = Required<Pick<Restaurant, 'slug' | 'id'>>

const HomeMapDataLoader = memo(
  graphql(
    (props: {
      onLoadedRestaurantDetail: Function
      onLoadedRestaurants: Function
    }) => {
      const om = useOvermind()
      const state = om.state.home.currentState
      let all: RestaurantIdentified[] = []
      let single: RestaurantIdentified | null = null

      if (isRestaurantState(state)) {
        single = {
          id: state.restaurantId,
          slug: state.restaurantSlug,
        }
        const searchState = om.state.home.lastSearchState
        all = [single, ...(searchState?.results ?? [])]
      } else if (isSearchState(state)) {
        const searchState = om.state.home.lastSearchState
        all = searchState?.results ?? []
      } else if (isHomeState(state)) {
        // for now, bad abstraction we should generalize in states
        // @ts-ignore
        all = om.state.home.topDishes
          .map((x) => x.top_restaurants)
          .flat()
          .filter((x) => x?.id)
          .map((x) => ({ id: x.id, slug: x.slug }))
          // slicing for now
          .slice(0, 50)
      }

      const allIds = [...new Set(all.map((x) => x.id))]
      const allResults = allIds
        .map((id) => all.find((x) => x.id === id))
        .filter(Boolean)

      const restaurants = uniqBy(
        allResults.map(({ id, slug }) => {
          const r = useRestaurantQuery(slug)
          const coords = r.location?.coordinates
          return {
            id: id ?? r.id,
            slug,
            name: r.name,
            location: {
              coordinates: [coords?.[0], coords?.[1]],
            },
          }
        }),
        (x) => `${x.location.coordinates[0]}${x.location.coordinates[1]}`
      )
        // ensure has location
        .filter((x) => !!x.location.coordinates[0])

      useEffect(() => {
        props.onLoadedRestaurants?.(restaurants)
      }, [JSON.stringify(restaurants.map((x) => x.location?.coordinates))])

      const restaurantDetail = single
        ? restaurants.find((x) => x.id === single.id)
        : null
      useEffect(() => {
        props.onLoadedRestaurantDetail?.(restaurantDetail)
      }, [JSON.stringify(restaurantDetail?.location?.coordinates ?? null)])
    }
  )
)

const getStateLocation = (state: HomeStateItem) => ({
  center: state.center,
  span: state.span,
})

const getLngLat = (coords: number[]) => {
  return {
    lng: coords[0],
    lat: coords[1],
  }
}

const getMinLngLat = (ll: LngLat, max: number) => {
  return getLngLat([Math.min(max, ll.lng), Math.min(max, ll.lat)])
}

const HomeMapContent = memo(function HomeMap({
  restaurants,
  restaurantDetail,
}: {
  restaurantDetail: Restaurant | null
  restaurants: Restaurant[] | null
}) {
  const om = useOvermind()
  const isSmall = useMediaQueryIsSmall()
  const state = om.state.home.currentState
  const { drawerWidth, width, paddingLeft } = useMapSize(isSmall)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const [getLocation, setLocation] = useStateFn(getStateLocation(state))
  const [selected, setSelected] = useState({
    id: om.state.home.selectedRestaurant?.id,
    span: state.span,
    // center: state.center,
    via: 'select' as 'select' | 'hover' | 'detail',
  })

  const { center, span } = getLocation()

  // SELECTED
  const selectedId = om.state.home.selectedRestaurant?.id
  useEffect(() => {
    if (selectedId) {
      setSelected({
        id: selectedId,
        via: 'select',
        span: getMinLngLat(state.span, 0.025),
      })
    }
  }, [selectedId])

  // HOVERED
  const hoveredId =
    om.state.home.hoveredRestaurant && om.state.home.hoveredRestaurant.id
  useEffect(() => {
    if (hoveredId) {
      setSelected({
        id: hoveredId,
        via: 'hover',
        span: getMinLngLat(state.span, 0.02),
      })
    }
  }, [hoveredId])

  // DETAIL
  const detailId = restaurantDetail?.id
  useEffect(() => {
    if (detailId) {
      setSelected({
        id: detailId,
        via: 'detail',
        span: getMinLngLat(state.span, 0.0025),
      })
    }
  }, [detailId])

  // gather restaruants
  const isLoading = restaurants[0]?.location?.coordinates[0] === null
  const key = useLastValueWhen(
    () =>
      `${selected.id}${JSON.stringify(
        restaurants.map((x) => x.location?.coordinates)
      )}`,
    isLoading || (!restaurants.length && !restaurantDetail)
  )

  // sync down location from above state
  // gqless hack - touch the prop before memo
  restaurants[0]?.id
  const restaurantSelected = useMemo(
    () => (selected.id ? restaurants.find((x) => x.id === selected.id) : null),
    [key]
  )

  console.log({
    selected,
    restaurantDetail,
    restaurantSelected,
    key,
    center,
    span,
    restaurants,
  })

  useEffect(() => {
    if (!restaurantSelected) return
    const coords = restaurantSelected.location.coordinates
    console.log('restaurantSelected', restaurantSelected)
    console.log('SET LOCATION', restaurantSelected, coords)
    if (coords) {
      setLocation({
        center: getLngLat(coords),
        span: selected.span,
      })
    } else {
      setLocation(getStateLocation(state))
    }
  }, [
    restaurantSelected,
    JSON.stringify(state.center),
    JSON.stringify(state.span),
  ])

  const snapPoint = isSmall
    ? // avoid resizing to top "fully open drawer" snap
      Math.max(1, om.state.home.drawerSnapPoint)
    : 0
  const padding = isSmall
    ? {
        left: 0,
        top: 0,
        bottom: getWindowHeight() - getWindowHeight() * snapPoints[snapPoint],
        right: 0,
      }
    : {
        left: paddingLeft,
        top: searchBarHeight + 15 + 15,
        bottom: 0,
        right: drawerWidth > 600 ? 6 : 0,
      }

  const features = useMemo(() => getRestaurantMarkers(restaurants), [key])

  // stop map animation when moving away from page (see if this fixes some animation glitching/tearing)
  useLayoutEffect(() => {
    if (!map) return
    console.warn('test removing this')
    map.stop()
  }, [map, restaurants])

  return (
    <AbsoluteVStack
      position="absolute"
      top={0}
      right={0}
      bottom={0}
      zIndex={zIndexMap}
      width={width}
    >
      <Map
        center={center}
        span={span}
        padding={padding}
        features={features}
        mapRef={(map: mapboxgl.Map) => {
          setMap(map)
          setMapView(map)
        }}
        selected={selected.id}
        onSelect={(id) => {
          if (id !== om.state.home.selectedRestaurant?.id) {
            const restaurant = restaurants.find((x) => x.id === id)
            om.actions.home.setSelectedRestaurant({
              id: restaurant.id,
              slug: restaurant.slug,
            })
            if (om.state.home.currentStateType === 'search') {
              const index = restaurants.findIndex((x) => x.id === id)
              om.actions.home.setActiveIndex({
                index,
                event: om.state.home.isHoveringRestaurant ? 'hover' : 'pin',
              })
            }
          }
        }}
      />
    </AbsoluteVStack>
  )
})

const getMapStyle = (lense: Tag) => {
  switch (lense.name) {
    case 'Gems':
      return 'mapbox://styles/nwienert/ck675hkw702mt1ikstagge6yq'
    case 'Vibe':
      return 'mapbox://styles/nwienert/ckddrrhfa4dnc1io6yindi3hi'
  }
}

let ids = {}
const getNumId = (id: string): number => {
  ids[id] = ids[id] ?? Math.round(Math.random() * 10000000000)
  return ids[id]
}

const getRestaurantMarkers = (restaurants: Restaurant[]) => {
  const result: GeoJSON.Feature[] = []
  for (const restaurant of restaurants) {
    if (!restaurant.location?.coordinates) {
      continue
    }
    const percent = getRestaurantRating(restaurant.rating)
    const color = getRankingColor(percent)
    result.push({
      type: 'Feature',
      id: getNumId(restaurant.id),
      geometry: {
        type: 'Point',
        coordinates: restaurant.location.coordinates,
      },
      properties: {
        id: restaurant.id,
        title: restaurant.name ?? 'none',
        subtitle: 'Pho, Banh Mi',
        color: color,
      },
    })
    // result.push(
    //   new mapboxgl.Marker({
    //     color,
    //   }).setLngLat(restaurant.location.coordinates)
    // )
  }
  return result
}
// return restaurants
//   .filter((_, index) => {
//     if (!coordinates[index]) {
//       console.warn('noo coordinate')
//       return false
//     }
//     return true
//   })
//   .map((restaurant, index) => {
//     return new mapkit.MarkerAnnotation(coordinates[index], {
//       glyphText: index <= 12 ? `${index + 1}` : ``,
//       color: color,
//       title: index <= 3 ? restaurant.name : '',
//       subtitle: index >= 10 ? restaurant.name : '',
//       collisionMode: mapkit.Annotation.CollisionMode.Circle,
//       displayPriority:
//         index <= 10
//           ? mapkit.Annotation.DisplayPriority.Required // change to High to hide overlaps
//           : mapkit.Annotation.DisplayPriority.Low,
//       data: {
//         id: restaurant.id,
//         slug: restaurant.slug,
//       },
//     })
//   })
//   .reverse()
