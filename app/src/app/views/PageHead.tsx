import React from 'react'
import { useMedia, useThemeName } from 'snackui'

import { isWeb } from '../../constants/constants'
import { rgbString } from '../../helpers/rgb'
import { useCurrentLenseColor } from '../hooks/useCurrentLenseColor'

export const PageHead = (props: { children: any; isActive: boolean; color?: any }) => {
  const media = useMedia()
  const lenseColor = useCurrentLenseColor()
  const themeName = useThemeName()

  if (!isWeb) {
    return null
  }

  if (!props.isActive) {
    return null
  }

  const themeColor =
    props.color || media.sm ? (themeName === 'dark' ? '#000' : '#fff') : rgbString(lenseColor.rgb)

  const { Helmet } = require('react-helmet')
  return (
    <Helmet>
      <title>{props.children}</title>
      <meta name="theme-color" content={themeColor} />
    </Helmet>
  )
}
