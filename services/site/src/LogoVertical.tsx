import React, { memo } from 'react'
import { Size, Spacer, VStack } from 'snackui'

import { LogoCircle, LogoColor } from './DishLogo'

export const LogoVertical = memo(({ size }: { size?: Size }) => {
  return (
    <VStack
      className="logo-vertical"
      position="relative"
      zIndex={100000}
      cursor="pointer"
      alignItems="center"
      justifyContent="center"
      userSelect="none"
      paddingHorizontal={35}
    >
      <LogoCircle scale={1.5} />
      <Spacer size={40} />
      <LogoColor />
    </VStack>
  )
})

export const BrandMark = memo(() => {
  return <LogoCircle scale={3} />
})
