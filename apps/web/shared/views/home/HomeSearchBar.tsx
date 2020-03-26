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
import { Icon } from '../shared/Icon'
import { DishLogoButton } from './HomeControlsOverlay'
import { CloseButton } from './CloseButton'

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowRadius: 8,
    shadowOffset: { height: 2, width: 0 },
    marginHorizontal: -15,
    marginTop: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchArea: {
    borderLeftWidth: 1,
    borderColor: '#eee',
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
        <DishLogoButton />
        <VStack flex={1.7} style={styles.searchArea}>
          <TextInput
            value={om.state.home.currentState.searchQuery}
            onChangeText={(text) => om.actions.home.setSearchQuery(text)}
            placeholder="Search dish, cuisine"
            style={[styles.textInput, { fontSize: 20, paddingRight: 42 }]}
            onFocus={() => {
              // om.actions.home.clearSearch()
              // om.actions.home.getTopDishes()
            }}
          />
          <SearchCancelButton />
        </VStack>
        <VStack flex={1} style={styles.searchArea}>
          <TextInput
            // value=""
            onChangeText={() => {}}
            placeholder="in San Francisco"
            style={[styles.textInput, { paddingRight: 32, fontSize: 16 }]}
          />
          <SearchLocationButton />
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

const SearchCancelButton = memo(() => {
  const om = useOvermind()
  return (
    <ZStack fullscreen pointerEvents="none">
      <HStack flex={1} alignItems="center" justifyContent="center">
        <Spacer flex={1} />
        <VStack
          pointerEvents="auto"
          alignItems="center"
          justifyContent="center"
          paddingRight={10}
        >
          <CloseButton
            opacity={om.state.home.currentState.searchQuery === '' ? 0 : 1}
            disabled={om.state.home.currentState.searchQuery === ''}
            onPress={() => om.actions.home.popTo(om.state.home.lastHomeState)}
            size={12}
          />
        </VStack>
      </HStack>
    </ZStack>
  )
})

const SearchLocationButton = memo(() => {
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
            }}
            onPress={() => {
              om.actions.home.popTo(om.state.home.lastHomeState)
            }}
          >
            <Icon size={18} name="navigation" color="blue" opacity={0.5} />
          </TouchableOpacity>
        </VStack>
      </HStack>
    </ZStack>
  )
})
