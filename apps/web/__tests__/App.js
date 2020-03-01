import 'react-native'
import React from 'react'
import App from '../App.tsx'

// TODO BUG it wont run!
// https://github.com/expo/expo/issues/5296

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  renderer.create(<App />)
})
