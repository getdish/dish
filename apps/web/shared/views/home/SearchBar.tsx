import React from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

import { useOvermind } from '../../state/om'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.09)',
    shadowRadius: 4,
    shadowOffset: { height: 1, width: 0 },
  },
  textInput: {
    padding: 12,
    flex: 1,
    fontSize: 20,
  },
})

export default function SearchBar() {
  const om = useOvermind()
  return (
    <View style={styles.container}>
      <TextInput
        value={om.state.home.currentState.searchQuery}
        onChangeText={text => om.actions.home.runSearch(text)}
        placeholder="Search all of San Francisco"
        style={styles.textInput}
        onFocus={() => {
          om.actions.home.clearSearch()
          om.actions.home.getTopDishes()
        }}
      />

      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `input { outline: 0 }`,
        }}
      />

      {om.state.home.currentState.searchQuery !== '' && (
        <TouchableOpacity
          style={{
            padding: 10,
          }}
          onPress={() => {
            om.actions.home.setSearchQuery('')
            if (om.state.router.history.length > 1) {
              om.actions.router.back()
            }
          }}
        >
          <Text style={{ opacity: 0.5, fontSize: 22 }}>x</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
