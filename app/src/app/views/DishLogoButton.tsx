import { logoXsWidth } from '../../constants/constants'
import { useHomeCurrentHomeType } from '../homeStore'
import { Link } from './Link'
import { LogoCircle } from './Logo'
import { XStack, YStack, useDebounceValue } from '@dish/ui'
import React, { memo } from 'react'

export const DishLogoButton = memo(() => {
  const type = useHomeCurrentHomeType()
  const currentType = useDebounceValue(type, 40)
  // const searchBarTheme = useCurrentLenseColor()

  const wrapWithHomeLink = (el: any) => {
    return (
      <Link name={currentType.indexOf('home') === 0 ? null : 'home'}>
        <XStack
          className="ease-in-out-fast transform-origin-center"
          scale={0.8}
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
    <YStack className="ease-in-out-faster" position="relative" width={logoXsWidth}>
      {wrapWithHomeLink(<LogoCircle />)}
    </YStack>
  )
})
