import { Space, View, ViewProps, scrollTo } from '@o/ui'
import React, { memo } from 'react'
import { useNavigation } from 'react-navi'

import { LogoCircle, LogoColor } from './DishLogo'

export const LogoVertical = memo(
  ({ size, ...rest }: ViewProps & { size?: 'small' | 'medium' | 'large' }) => {
    const nav = useNavigation()
    return (
      <View
        className="logo-vertical"
        position="relative"
        zIndex={100000}
        cursor="pointer"
        alignItems="center"
        justifyContent="center"
        userSelect="none"
        padding={[0, 35]}
        onClick={async (e) => {
          e.preventDefault()
          if ((await nav.getRoute()).url.pathname === '/') {
            scrollTo(0)
          } else {
            nav.navigate('/')
          }
        }}
        {...rest}
      >
        <LogoCircle />
        <Space size={40} />
        <LogoColor />
      </View>
    )
  }
)

export const BrandMark = memo(() => {
  return <LogoCircle scale={3} />
})
