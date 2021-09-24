import { useStoreInstanceSelector } from '@dish/use-store'
import mapboxgl from 'mapbox-gl'
import React, { Suspense, memo, useEffect, useRef, useState } from 'react'
import { useDebounceEffect } from 'snackui'
import { AbsoluteVStack, VStack, useDebounceValue, useMedia } from 'snackui'

import { MAPBOX_ACCESS_TOKEN, isWeb } from '../constants/constants'
import { useAppMapKey } from './appMapStore'
import { useAppShouldShow } from './AppStore'
import { autocompletesStore } from './AutocompletesStore'
import { drawerStore } from './drawerStore'
import { mapStyles } from './mapStyles'

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

export default memo(function AppMapPIP() {
  const show = true //useAppShouldShow('map')

  // disable its stating twice..
  return null

  if (!isWeb || !show) {
    return null
  }

  const media = useMedia()

  return (
    <VStack
      className="ease-in-out"
      scale={0.8}
      x={15}
      y={15}
      {...(media.xs && {
        opacity: 0,
        pointerEvents: 'none',
      })}
    >
      <Suspense fallback={null}>
        <AppPIPContent />
      </Suspense>
    </VStack>
  )
})

const AppPIPContent = memo(() => {
  const media = useMedia()
  const isAtTop = useStoreInstanceSelector(drawerStore, (drawer) => drawer.snapIndexName === 'top')
  const position = useAppMapKey('currentPosition')
  const mapNode = useRef<HTMLDivElement>(null)
  const center = useDebounceValue(position.center, 300)
  const map = useRef<mapboxgl.Map>(null)

  const pipAction = (() => {
    if (isAtTop) {
      // move drawer down
      return () => {
        autocompletesStore.setVisible(false)
        drawerStore.setSnapIndex(1)
      }
    }
    // re-center
    // if (center[0] && !isEqual(center, appMapStore.position.center)) {
    //   return () => {
    //     appMapStore.setPosition({
    //       center: center,
    //       span: pipSpan(span),
    //     })
    //   }
    // }
  })()

  useEffect(() => {
    map.current?.setCenter([center.lng, center.lat])
  }, [center])

  useEffect(() => {
    if (!mapNode.current) return
    console.log('new map pip')
    // @ts-ignore
    map.current = new mapboxgl.Map({
      container: mapNode.current,
      style: mapStyles.dark,
      center,
      zoom: 11,
      attributionControl: false,
    })
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
      className="ease-in-out-slow"
      scale={1}
      cursor="pointer"
      pressStyle={{
        scale: 0.9,
      }}
      hoverStyle={{
        scale: 1.1,
      }}
      {...(media.xs && {
        display: 'none',
      })}
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
