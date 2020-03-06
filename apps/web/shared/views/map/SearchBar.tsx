import React from 'react'
import { Text, View } from 'react-native'
import SearchableDropdpwn from './SearchableDropdown.js'

import { useOvermind } from '../../state/om'

const styles = {
  container: {
    position: 'absolute',
    top: 10,
    left: '50%',
    width: 300,
    marginLeft: -150,
  },
}

export default function SearchBar() {
  const { state, actions } = useOvermind()
  return (
    <SearchableDropdpwn
      containerStyle={styles.container}
      items={state.map.search_results}
      textInputProps={{
        placeholder: 'Search by restaurant name',
        style: {
          padding: 12,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          backgroundColor: '#fff',
        },
        onTextChange: text => actions.map.restaurantSearch(text),
      }}
      itemStyle={{
        padding: 10,
        backgroundColor: '#fff',
        borderBottomColor: '#bbb',
        borderBottomWidth: 1,
      }}
      onItemSelect={item => {
        actions.map.setSelected(item.id)
      }}
    />
  )
}
