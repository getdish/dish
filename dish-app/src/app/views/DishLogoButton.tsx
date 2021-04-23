import React, { memo } from 'react'
import { AbsoluteVStack, HStack, VStack, useMedia } from 'snackui'

import { isWeb, logoHeight, logoWidth, logoXsHeight, logoXsWidth } from '../../constants/constants'
import { useHomeStore } from '../homeStore'
import { Link } from './Link'
import { LinkButtonProps } from './LinkProps'
import { LogoCircle, LogoColor } from './Logo'

const linkButtonProps: LinkButtonProps = {
  className: 'ease-in-out-fast transform-origin-center',
  transform: [{ scale: 1 }],
  hoverStyle: {
    transform: [{ scale: 1.05 }, { translateY: -1 }],
  },
  pressStyle: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
}

export const DishLogoButton = memo(({ color }: { color?: string }) => {
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
      className="ease-in-out-faster"
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
            <LogoColor scale={1.1} color={color} />
          </VStack>
        )}
      </VStack>
      <AbsoluteVStack
        pointerEvents={media.xs ? 'auto' : 'none'}
        opacity={media.xs ? 1 : 0}
        fullscreen
        alignItems="center"
        justifyContent="center"
        width={logoXsWidth}
        height={logoXsHeight}
        {...(media.sm && {
          transform: [{ scale: 0.9 }, { translateY: -3.5 }],
        })}
      >
        {wrapWithHomeLink(<LogoCircle />)}
      </AbsoluteVStack>
    </VStack>
  )
})
