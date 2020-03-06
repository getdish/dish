import React from 'react'

import SearchBar from './SearchBar'
import Map from './Map'
import Bottom from './Bottom'

export const LabMap = () => {
  return (
    <div>
      <Map />
      <SearchBar />
      <Bottom />
    </div>
  )
}
