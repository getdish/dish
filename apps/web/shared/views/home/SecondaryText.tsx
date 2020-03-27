import React from 'react'
import { Text, TextProps, StyleSheet } from 'react-native'

export const SecondaryText = (props: TextProps & { children: any }) => {
  return <Text {...props} style={[styles.secondaryText, props.style]} />
}

const styles = StyleSheet.create({
  secondaryText: {
    color: '#777',
    fontSize: 13,
  },
})
