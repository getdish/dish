import React from 'react'
import { Platform } from 'react-native'

import { isWorker } from '../../constants/platforms'

export const PageTitleTag = (props: { children: any }) => {
  if (isWorker || Platform.OS !== 'web') {
    return null
  }
  const { Helmet } = require('react-helmet')
  return (
    <Helmet>
      <title>{props.children}</title>
    </Helmet>
  )
}
