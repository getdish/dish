import { AppMapSpotlight } from './AppMapSpotlight'
import React, { memo } from 'react'

export default memo(function AppMapContainer(props: { children: React.ReactNode }) {
  // TODO handle animations etc
  return (
    <>
      <AppMapSpotlight />
      {props.children}
    </>
  )
})
