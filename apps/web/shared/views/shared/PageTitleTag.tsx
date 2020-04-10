import React from 'react'
import { isWorker } from '../../constants'

export const PageTitleTag = (props: { children: any }) => {
  if (isWorker) {
    return null
  }
  const { Helmet } = require('react-helmet')
  return (
    <Helmet>
      <title>{props.children}</title>
    </Helmet>
  )
}
