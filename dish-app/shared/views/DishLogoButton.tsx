import React, { memo } from 'react'
import { AbsoluteVStack, VStack } from 'snackui'

import { useIsReallyNarrow } from '../hooks/useIs'
import { Logo, LogoSmall } from './Logo'
import { logoStyles } from './logoStyles'
import { LinkButton } from './ui/LinkButton'
import { LinkButtonProps } from './ui/LinkProps'

const linkButtonProps: LinkButtonProps = {
  className: 'ease-in-out-fast',
  opacity: 0,
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
  const isReallySmall = useIsReallyNarrow()
  return (
    <VStack
      className="ease-in-out-fast"
      width={
        isReallySmall ? logoStyles.reallySmall.width : logoStyles.default.width
      }
      height={logoStyles.default.height}
    >
      <LinkButton
        {...linkButtonProps}
        {...logoStyles.default}
        opacity={isReallySmall ? 0 : 1}
        pointerEvents={isReallySmall ? 'none' : 'auto'}
      >
        <Logo />
      </LinkButton>
      <AbsoluteVStack
        pointerEvents={isReallySmall ? 'auto' : 'none'}
        fullscreen
        alignItems="center"
        justifyContent="center"
        transform={[{ translateY: -2 }]}
        {...logoStyles.reallySmall}
        zIndex={-1}
      >
        <LinkButton {...linkButtonProps} opacity={!isReallySmall ? 0 : 1}>
          <LogoSmall />
        </LinkButton>
      </AbsoluteVStack>
    </VStack>
  )
})
