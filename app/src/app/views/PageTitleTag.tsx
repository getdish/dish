import React from 'react'

import { isWeb } from '../../constants/constants'

export const PageTitleTag = (props: { children: any }) => {
  if (!isWeb) {
    return null
  }
  const { Helmet } = require('react-helmet')
  return (
    <Helmet>
      <title>{props.children}</title>
    </Helmet>
  )
}
