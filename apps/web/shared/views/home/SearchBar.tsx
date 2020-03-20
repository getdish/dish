import React from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

import { useOvermind } from '../../state/om'
import { ZStack, HStack, VStack } from '../shared/Stacks'
import { Spacer } from '../shared/Spacer'

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
    textAlign: 'center',
  },
})

export default function SearchBar() {
  const om = useOvermind()
  return (
    <View style={styles.container}>
      <TextInput
        value={om.state.home.currentState.searchQuery}
        onChangeText={text => om.actions.home.runSearch(text)}
        placeholder="The food in San Francisco"
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

      <ZStack fullscreen pointerEvents="none">
        <HStack flex={1}>
          <Spacer flex={1} />
          <VStack pointerEvents="auto">
            <TouchableOpacity
              style={{
                padding: 10,
                opacity: om.state.home.currentState.searchQuery === '' ? 0 : 1,
              }}
              onPress={() => {
                om.actions.home.setSearchQuery('')
                if (om.state.router.history.length > 1) {
                  om.actions.router.back()
                }
              }}
            >
              <Text style={{ opacity: 0.5, fontSize: 12 }}>❌</Text>
            </TouchableOpacity>
          </VStack>
        </HStack>
      </ZStack>
    </View>
  )
}
