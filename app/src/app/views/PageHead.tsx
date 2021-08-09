import React from 'react'

import { isWeb } from '../../constants/constants'
import { rgbString } from '../../helpers/rgb'
import { useCurrentLenseColor } from '../hooks/useCurrentLenseColor'

export const PageHead = (props: { children: any }) => {
  // const themeName = useTheme()
  const lenseColor = useCurrentLenseColor()
  const themeColor = rgbString(lenseColor.rgb, 1)
  if (!isWeb) {
    return null
  }
  const { Helmet } = require('react-helmet')
  return (
    <Helmet>
      <title>{props.children}</title>
      <meta name="theme-color" content={themeColor} />
    </Helmet>
  )
}
