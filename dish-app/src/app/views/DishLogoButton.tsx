import React, { memo } from 'react'
import { AbsoluteVStack, HStack, VStack, useMedia } from 'snackui'

import {
  logoHeight,
  logoWidth,
  logoXsHeight,
  logoXsWidth,
} from '../../constants/constants'
import { useHomeStore } from '../homeStore'
import { Link } from './Link'
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
  const { currentStateType } = useHomeStore()
  const wrapWithHomeLink = (el: any) => {
    return currentStateType.indexOf('home') === 0 ? (
      el
    ) : (
      <Link name="home">
        <HStack {...linkButtonProps}>{el}</HStack>
      </Link>
    )
  }

  return (
    <VStack
      className="ease-in-out-faster transform-transform"
      width={media.xs ? logoXsWidth : logoWidth}
      height={logoHeight}
      position="relative"
    >
      <VStack
        opacity={1}
        pointerEvents={media.xs ? 'none' : 'auto'}
        {...(media.xs && {
          opacity: 0,
        })}
      >
        {wrapWithHomeLink(
          <VStack marginVertical={-5}>
            <LogoColor scale={1.05} />
          </VStack>
        )}
      </VStack>
      <AbsoluteVStack
        pointerEvents={media.xs ? 'auto' : 'none'}
        opacity={media.xs ? 1 : 0}
        fullscreen
        alignItems="center"
        justifyContent="center"
        top={-2}
        width={logoXsWidth}
        height={logoXsHeight}
        {...(media.sm && {
          transform: [{ scale: 0.9 }],
        })}
      >
        {wrapWithHomeLink(<LogoSmall />)}
      </AbsoluteVStack>
    </VStack>
  )
})
