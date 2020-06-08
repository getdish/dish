import React, { memo } from 'react'
import { Image } from 'react-native'

import { LinkButton } from '../ui/LinkButton'

export const DishLogoButton = memo(() => {
  const scale = 0.057
  return (
    <LinkButton
      name="home"
      paddingVertical={10}
      paddingHorizontal={24}
      marginVertical={-4}
      // transform={[{ rotate: '8deg' }]}
    >
      <Image
        source={require('../../assets/logo.png').default}
        style={{ width: 1251 * scale, height: 614 * scale }}
      />
    </LinkButton>
  )
})
