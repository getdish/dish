import React from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useHistory } from 'react-router-dom'

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
  const { state, actions } = useOvermind()
  let history = useHistory()
  return (
    <View style={styles.container}>
      <TextInput
        value={state.home.searchQuery}
        onChangeText={text => actions.home.restaurantSearch(text)}
        placeholder="Search all of San Francisco"
        style={styles.textInput}
      />

      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `input { outline: 0 }`,
        }}
      />

      {state.home.searchQuery !== '' && (
        <TouchableOpacity
          style={{
            padding: 10,
          }}
          onPress={() => {
            actions.home.setSearchQuery('')
            history.goBack()
          }}
        >
          <Text style={{ opacity: 0.5, fontSize: 22 }}>x</Text>
        </TouchableOpacity>
      )}
    </View>
    // <SearchableDropdpwn
    //   containerStyle={styles.container}
    //   items={}
    //   textInputProps={{

    //   }}
    //   itemStyle={{
    //     padding: 10,
    //     backgroundColor: '#fff',
    //     borderBottomColor: '#bbb',
    //     borderBottomWidth: 1,
    //   }}
    //   onItemSelect={item => {
    //     history.push('/e/' + item.id)
    //   }}
    // />
  )
}
