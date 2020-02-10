import React, { useState, useEffect } from 'react'
import ReactMap, { Feature, Layer, Marker } from 'react-mapbox-gl'
import { StyleSheet, Text, View } from 'react-native'
import MapBox, { LngLatBounds, Popup } from 'mapbox-gl'
import {EMOJIS} from '../../../utils/emoji'

export default ({coordinates}: any) => {

  let _r = null

  useEffect(() => {

      _r.classList.remove('onbeforeinsert')



  }, [])


  return (
    <Marker 
      coordinates={coordinates}>
        <div className='dish-marker onbeforeinsert' ref={c => {_r = c}}><p>{EMOJIS[Math.floor(Math.random() * EMOJIS.length)]}</p></div>
      </Marker>
  )

}