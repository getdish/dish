import React, { memo } from 'react'
import { AbsoluteVStack, HStack, VStack, useDebounceValue, useMedia } from 'snackui'

import { logoHeight, logoWidth, logoXsHeight, logoXsWidth } from '../../constants/constants'
import { useHomeCurrentHomeType } from '../homeStore'
import { useCurrentLenseColor } from '../hooks/useCurrentLenseColor'
import { Link } from './Link'
import { LogoCircle, LogoColor } from './Logo'

export const DishLogoButton = memo(({ color }: { color?: string }) => {
  const media = useMedia()
  const type = useHomeCurrentHomeType()
  const currentType = useDebounceValue(type, 40)
  const searchBarTheme = useCurrentLenseColor()

  const wrapWithHomeLink = (el: any) => {
    return (
      <Link name={currentType.indexOf('home') === 0 ? null : 'home'}>
        <HStack
          className="ease-in-out-fast transform-origin-center"
          scale={1}
          hoverStyle={{
            scale: 1.05,
            y: -1,
          }}
          pressStyle={{
            opacity: 0.8,
            scale: 0.95,
          }}
        >
          {el}
        </HStack>
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
            <LogoColor
              color={media.sm ? undefined : searchBarTheme.name === 'light' ? undefined : '#fff'}
            />
          </VStack>
        )}
      </VStack>
      <AbsoluteVStack
        className="123321"
        pointerEvents={media.xs ? 'auto' : 'none'}
        opacity={media.xs ? 1 : 0}
        alignItems="center"
        justifyContent="center"
        width={logoXsWidth}
        height={logoXsHeight}
        scale={0.85}
        y={-3.5}
      >
        {wrapWithHomeLink(<LogoCircle />)}
      </AbsoluteVStack>
    </VStack>
  )
})
