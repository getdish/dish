import { AbsoluteYStack, XStack, YStack, useDebounceValue, useMedia } from '@dish/ui'
import React, { memo } from 'react'

import { logoHeight, logoSmWidth, logoXsHeight, logoXsWidth } from '../../constants/constants'
import { useHomeCurrentHomeType } from '../homeStore'
import { Link } from './Link'
import { LogoCircle, LogoColor } from './Logo'

export const DishLogoButton = memo(() => {
  const media = useMedia()
  const type = useHomeCurrentHomeType()
  const currentType = useDebounceValue(type, 40)
  // const searchBarTheme = useCurrentLenseColor()

  const wrapWithHomeLink = (el: any) => {
    return (
      <Link name={currentType.indexOf('home') === 0 ? null : 'home'}>
        <XStack
          className="ease-in-out-fast transform-origin-center"
          scale={1}
          hoverStyle={{
            scale: 1.025,
          }}
          pressStyle={{
            opacity: 0.8,
            scale: 0.975,
          }}
        >
          {el}
        </XStack>
      </Link>
    )
  }

  return (
    <YStack
      className="ease-in-out-faster"
      width={logoSmWidth}
      height={logoHeight}
      position="relative"
      $xs={{
        width: logoXsWidth,
      }}
    >
      <YStack
        opacity={1}
        pointerEvents={media.xs ? 'none' : 'auto'}
        y={-4}
        $xs={{
          opacity: 0,
        }}
      >
        {wrapWithHomeLink(
          // marginVertical={-7} native only? web wroks
          <YStack marginVertical="auto">
            <LogoColor />
          </YStack>
        )}
      </YStack>
      <AbsoluteYStack
        pointerEvents="none"
        opacity={0}
        alignSelf="center"
        width={logoXsWidth}
        height={logoXsHeight}
        scale={0.75}
        y={7}
        $xs={{
          opacity: 1,
          pointerEvents: 'auto',
        }}
      >
        {wrapWithHomeLink(<LogoCircle />)}
      </AbsoluteYStack>
    </YStack>
  )
})
