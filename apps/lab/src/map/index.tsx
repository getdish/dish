import { Stack, View } from '@o/ui'
import React from 'react'

import Map from './Map'
import Sidebar from './Sidebar'

export const LabMap = () => {
  return (
    <Stack direction="horizontal">
      <View flex={1}>
        <Sidebar />
      </View>
      <View height="100%" flex={2.5}>
        <Map />
      </View>
    </Stack>
  )
}
