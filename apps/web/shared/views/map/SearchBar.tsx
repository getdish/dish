import React from 'react'
import { Text, View, TextInput } from 'react-native'
import { useHistory } from 'react-router-dom'

import { useOvermind } from '../../state/om'

import SearchableDropdpwn from './SearchableDropdown.js'

const styles = {
  container: {
    flex: 1,
  },
  textInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    flex: 1,
    fontSize: 18,
  },
}

export default function SearchBar() {
  const { state, actions } = useOvermind()
  let history = useHistory()
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={text => actions.home.restaurantSearch(text)}
        placeholder="Search by restaurant name"
        style={styles.textInput}
      />
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
