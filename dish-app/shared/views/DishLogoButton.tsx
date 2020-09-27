import { AbsoluteVStack, VStack } from '@dish/ui'
import React, { memo } from 'react'

import { useIsReallyNarrow } from '../hooks/useIs'
import { omStatic } from '../state/omStatic'
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
      className="ease-in-out-faster"
      width={
        isReallySmall ? logoStyles.reallySmall.width : logoStyles.default.width
      }
      height={logoStyles.default.height}
      onPress={() => {
        if (omStatic.state.home.currentStateType === 'home') {
          // already on home
        }
      }}
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
        pointerEvents="none"
        fullscreen
        alignItems="center"
        justifyContent="center"
        zIndex={-1}
      >
        <LinkButton
          {...linkButtonProps}
          {...logoStyles.reallySmall}
          opacity={!isReallySmall ? 0 : 1}
        >
          <LogoSmall />
        </LinkButton>
      </AbsoluteVStack>
    </VStack>
  )
})
