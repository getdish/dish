import React, { memo } from 'react'
import { AbsoluteVStack, VStack, useMedia } from 'snackui'

import { logoHeight, logoWidth, logoXsHeight, logoXsWidth } from '../constants'
import { LogoColor, LogoSmall } from './Logo'
import { LinkButton } from './ui/LinkButton'
import { LinkButtonProps } from './ui/LinkProps'

const linkButtonProps: LinkButtonProps = {
  className: 'ease-in-out-fast',
  name: 'home',
  hoverStyle: {
    transform: [{ scale: 1.05 }],
  },
  pressStyle: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
}

export const DishLogoButton = memo(() => {
  const media = useMedia()
  return (
    <VStack
      className="ease-in-out-fast"
      width={media.xs ? logoXsWidth : logoWidth}
      height={logoHeight}
      position="relative"
    >
      <VStack
        opacity={media.xs ? 0 : 1}
        pointerEvents={media.xs ? 'none' : 'auto'}
      >
        <LinkButton {...linkButtonProps}>
          <LogoColor />
        </LinkButton>
      </VStack>
      <AbsoluteVStack
        pointerEvents={media.xs ? 'auto' : 'none'}
        opacity={media.xs ? 1 : 0}
        fullscreen
        alignItems="center"
        justifyContent="center"
        transform={[{ translateY: -2 }]}
        width={logoXsWidth}
        height={logoXsHeight}
        zIndex={-1}
      >
        <LinkButton {...linkButtonProps}>
          <LogoSmall />
        </LinkButton>
      </AbsoluteVStack>
    </VStack>
  )
})
