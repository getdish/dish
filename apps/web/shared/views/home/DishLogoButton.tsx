import React, { memo } from 'react'
import { Image } from 'react-native'

import { LinkButton } from '../ui/LinkButton'

export const DishLogoButton = memo(() => {
  const scale = 0.057
  return (
    <LinkButton
      name="home"
      paddingVertical={10}
      paddingHorizontal={20}
      marginVertical={-4}
      hoverStyle={{
        transform: [{ scale: 1.05 }],
      }}
    >
      <Image
        source={require('../../assets/logo.svg').default}
        style={{ width: 1201 * scale, height: 544 * scale }}
      />
    </LinkButton>
  )
})
