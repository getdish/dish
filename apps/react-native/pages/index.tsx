import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import dynamic from 'next/dynamic'
import OvermindProvider from '../lib/store/OvermindProvider'
const Map = dynamic(() => import('../components/Map/web/Map'),  { ssr: false })

export default OvermindProvider(() => {
  return (
    <View style={{flex: 1}}>
      <Map/>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  link: {
    color: 'blue',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  text: { 
    alignItems: 'center',
    fontSize: 24,
    marginBottom: 24,
  },
})
