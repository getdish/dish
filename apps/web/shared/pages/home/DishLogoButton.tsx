import React, { memo } from 'react'
import { Image } from 'react-native'

import { AbsoluteVStack, VStack } from '../../../../../packages/ui/src'
import { LinkButton } from '../../views/ui/LinkButton'
import { useMediaQueryIsReallySmall } from './useMediaQueryIs'

const linkButtonProps = {
  className: 'ease-in-out-slow',
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

const styles = {
  default: { width: 1201 * 0.061, height: 544 * 0.061 },
  reallySmall: { width: 723 * 0.044, height: 898 * 0.044 },
}

export const DishLogoButton = memo(() => {
  const isReallySmall = useMediaQueryIsReallySmall()
  return (
    <VStack
      className="ease-in-out"
      width={isReallySmall ? styles.reallySmall.width : styles.default.width}
      height={styles.default.height}
    >
      <LinkButton
        {...linkButtonProps}
        {...styles.default}
        opacity={isReallySmall ? 0 : 1}
      >
        <Image
          source={require('../../assets/logo.svg').default}
          style={styles.default}
        />
      </LinkButton>
      <AbsoluteVStack
        pointerEvents="none"
        fullscreen
        alignItems="center"
        justifyContent="center"
      >
        <LinkButton
          {...linkButtonProps}
          {...styles.reallySmall}
          opacity={!isReallySmall ? 0 : 1}
        >
          <Image
            source={require('../../assets/d.svg').default}
            style={styles.reallySmall}
          />
        </LinkButton>
      </AbsoluteVStack>
    </VStack>
  )
})
