import React, { memo } from 'react'
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
    borderRadius: 10,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowRadius: 8,
    shadowOffset: { height: 1, width: 0 },
    marginHorizontal: 15,
  },
  searchArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  textInput: {
    padding: 11,
    paddingHorizontal: 16,
    flex: 1,
    fontSize: 18,
  },
})

export default memo(function HomeSearchBar() {
  const om = useOvermind()
  return (
    <View style={styles.container}>
      <HStack>
        <VStack
          flex={2}
          borderTopLeftRadius={10}
          borderBottomLeftRadius={10}
          style={styles.searchArea}
        >
          <TextInput
            value={om.state.home.currentState.searchQuery}
            onChangeText={(text) => om.actions.home.setSearchQuery(text)}
            placeholder="Search dish, cuisine, craving"
            style={styles.textInput}
            onFocus={() => {
              // om.actions.home.clearSearch()
              // om.actions.home.getTopDishes()
            }}
          />
          <SearchCancelButton />
        </VStack>
        <VStack
          borderTopRightRadius={10}
          borderBottomRightRadius={10}
          borderLeftWidth={0}
          flex={1}
          style={styles.searchArea}
        >
          <TextInput
            // value=""
            onChangeText={() => {}}
            placeholder="San Francisco"
            style={styles.textInput}
          />
          {/* <SearchCancelButton /> */}
        </VStack>
      </HStack>

      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `input { outline: 0 }`,
        }}
      />
    </View>
  )
})

function SearchCancelButton() {
  const om = useOvermind()
  return (
    <ZStack fullscreen pointerEvents="none">
      <HStack flex={1} alignItems="center" justifyContent="center">
        <Spacer flex={1} />
        <VStack
          pointerEvents="auto"
          alignItems="center"
          justifyContent="center"
        >
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
  )
}
