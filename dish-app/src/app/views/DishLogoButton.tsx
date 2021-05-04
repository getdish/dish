import React, { memo } from 'react'
import { useDebounceValue } from 'snackui'
import { AbsoluteVStack, HStack, VStack, useMedia } from 'snackui'

import { logoHeight, logoWidth, logoXsHeight, logoXsWidth } from '../../constants/constants'
import { useHomeCurrentHomeType, useHomeStoreSelector } from '../homeStore'
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
  const type = useHomeCurrentHomeType()
  const currentType = useDebounceValue(type, 40)
  const wrapWithHomeLink = (el: any) => {
    return (
      <Link name={currentType.indexOf('home') === 0 ? null : 'home'}>
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
          // marginVertical={-7} native only? web wroks
          <VStack marginVertical="auto">
            <LogoColor color={color} />
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
          transform: [{ scale: 0.85 }, { translateY: -3.5 }],
        })}
      >
        {wrapWithHomeLink(<LogoCircle />)}
      </AbsoluteVStack>
    </VStack>
  )
})
