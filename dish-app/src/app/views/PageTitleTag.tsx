import React from 'react'
import { Platform } from 'react-native'

export const PageTitleTag = (props: { children: any }) => {
  if (Platform.OS !== 'web') {
    return null
  }
  const { Helmet } = require('react-helmet')
  return (
    <Helmet>
      <title>{props.children}</title>
    </Helmet>
  )
}
