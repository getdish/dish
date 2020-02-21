import { Row } from '@o/ui'
import React from 'react'

import Map from './Map'
import Sidebar from './Sidebar'

export const LabMap = () => {
  return (
    <Row>
      <Sidebar />
      <Map />
    </Row>
  )
}
