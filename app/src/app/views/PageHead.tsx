import { isWeb } from '../../constants/constants'
import { useCurrentLenseColor } from '../hooks/useCurrentLenseColor'
import { useMedia, useThemeName } from '@dish/ui'
import React from 'react'

export const PageHead = (props: { children: any; isActive: boolean; color?: any }) => {
  const media = useMedia()
  const { name } = useCurrentLenseColor()
  const themeName = useThemeName()

  if (!isWeb) {
    return null
  }

  if (!props.isActive) {
    return null
  }

  const themeColor =
    props.color || media.sm ? (themeName === 'dark' ? '#000' : '#fff') : `var(--${name})`

  const { Helmet } = require('react-helmet')
  return (
    <Helmet>
      <title>{props.children}</title>
      <meta name="theme-color" content={themeColor} />
      <link href="/assets/fonts/inter.css" rel="stylesheet" />
    </Helmet>
  )
}
