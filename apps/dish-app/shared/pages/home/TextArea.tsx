import React, { useState } from 'react'
import { TextInput } from 'react-native'

import { textStyles } from './Input'

export default function TextArea(props) {
  const [scrollHeight, setScrollHeight] = useState(100)
  return (
    <TextInput
      style={[textStyles.textField, { height: scrollHeight }]}
      onChange={(e) => setScrollHeight(e.target['scrollHeight'])}
      {...props}
    />
  )
}
