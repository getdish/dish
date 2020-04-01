import React from 'react'
import { Image } from 'react-native'

import { LinkButton } from '../shared/Link'

export const DishLogoButton = () => {
  const scale = 0.06
  return (
    <LinkButton
      name="home"
      paddingVertical={10}
      paddingHorizontal={20}
      marginVertical={-2}
      backgroundColor="#fff"
    >
      <Image
        source={require('../../assets/logo.png')}
        style={{ width: 1211 * scale, height: 605 * scale }}
      />
    </LinkButton>
  )
}
