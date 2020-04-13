import React from 'react'
import { Image } from 'react-native'

import { LinkButton } from '../shared/Link'

export const DishLogoButton = () => {
  const scale = 0.055
  return (
    <LinkButton
      name="home"
      paddingVertical={10}
      paddingHorizontal={24}
      marginVertical={-2}
    >
      <Image
        source={require('../../assets/logo.png')}
        style={{ width: 1251 * scale, height: 614 * scale }}
      />
    </LinkButton>
  )
}
