import React, { memo } from 'react'
import { Image } from 'react-native'

import { LinkButton } from '../../views/ui/LinkButton'

export const DishLogoButton = memo(() => {
  const scale = 0.061
  const style = { width: 1201 * scale, height: 544 * scale }
  return (
    <LinkButton
      name="home"
      hoverStyle={{
        transform: [{ scale: 1.05 }],
      }}
      pressStyle={{
        opacity: 0.8,
        transform: [{ scale: 0.95 }],
      }}
      {...style}
    >
      <Image source={require('../../assets/logo.svg').default} style={style} />
    </LinkButton>
  )
})
