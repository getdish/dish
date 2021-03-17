import words from '!raw-loader!../public/images/logomark-solid.svg'
import { scrollTo, Space, SVG, View, ViewProps } from '@o/ui'
import { useTheme } from 'gloss'
import React, { memo } from 'react'
import { useNavigation } from 'react-navi'
import { Logo, LogoCircle, LogoColor } from './DishLogo'

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
        onClick={async e => {
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
  },
)

export const BrandMark = memo(() => {
  return <LogoCircle scale={3} />
})

const wordsLines = `${words}`.split('\n')
wordsLines.splice(15, 4)
const cleanBrand = wordsLines.join('')

const BrandWords = memo(({ fill, ...props }: any) => {
  const theme = useTheme()
  const f = fill || theme.color
  return <SVG svg={cleanBrand} cleanup fill={`${f}`} {...props} />
})
