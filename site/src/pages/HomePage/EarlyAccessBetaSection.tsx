import { FullScreen, View } from '@o/ui'
import React from 'react'

import { EarlyAccessContent } from './EarlyAccessContent'
import { LineSep } from './LineSep'

export default ({ outside = null }: any) => {
  return (
    <>
      <FullScreen top={40} />
      <LineSep
        top="auto"
        bottom={0}
        height={120}
        left={'-20%'}
        right={0}
        width="130%"
        minWidth={1200}
        transform={{ scaleX: -1 }}
        zIndex={1}
        opacity={0.2}
      />
      {outside}
      <View margin={['auto', 0]} padding={[20, 0]} transform={{ y: '-5%' }} xs-transform={{ y: 0 }}>
        <EarlyAccessContent />
      </View>
    </>
  )
}
