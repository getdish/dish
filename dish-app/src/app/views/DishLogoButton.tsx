import React, { memo } from 'react'
import { AbsoluteVStack, VStack, useMedia } from 'snackui'

import {
  logoHeight,
  logoWidth,
  logoXsHeight,
  logoXsWidth,
} from '../../constants/constants'
import { Link } from './Link'
import { LinkButton } from './LinkButton'
import { LinkButtonProps } from './LinkProps'
import { LogoColor, LogoSmall } from './Logo'

const linkButtonProps: LinkButtonProps = {
  className: 'ease-in-out-fast',
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
        <Link name="home">
          <HStack {...linkButtonProps}>
            <LogoColor />
          </HStack>
        </Link>
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
      >
        <Link name="home">
          <LinkButton {...linkButtonProps}>
            <LogoSmall />
          </LinkButton>
        </Link>
      </AbsoluteVStack>
    </VStack>
  )
})
