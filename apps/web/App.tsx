import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { ApolloProvider } from '@apollo/client'
import { ModelBase } from '@dish/models'
import { Provider } from 'overmind-react'
import { om } from './shared/state/om'
import { LabDishes } from './shared/state/dishes'

export default function App() {
  return (
    <ApolloProvider client={ModelBase.client}>
      <Provider value={om}>
        <View style={styles.container}>
          <LabDishes />
        </View>
      </Provider>
    </ApolloProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
