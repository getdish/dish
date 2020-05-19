import React, { memo } from 'react'
import { Image } from 'react-native'

import { LinkButton } from '../ui/LinkButton'

export const DishLogoButton = memo(() => {
  const scale = 0.059
  return (
    <LinkButton
      name="home"
      paddingVertical={10}
      paddingHorizontal={24}
      marginVertical={-2}
    >
      <Image
        source={require('../../assets/logo.png').default}
        style={{ width: 1251 * scale, height: 614 * scale }}
      />
    </LinkButton>
  )
})
