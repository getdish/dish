import React from 'react'
import { Image } from 'react-native'

import { LinkButton } from '../shared/Link'

export const DishLogoButton = () => {
  return (
    <LinkButton
      name="home"
      paddingVertical={10}
      paddingHorizontal={15}
      backgroundColor="#fff"
    >
      <Image
        source={require('../../assets/logo.png')}
        style={{ width: 1211 * 0.052, height: 605 * 0.052 }}
      />
    </LinkButton>
  )
}
