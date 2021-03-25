import { Stack, View, gloss, useTheme } from '@o/ui'
import { Box } from 'gloss'
import React from 'react'

import { useSiteStore } from '../SiteStore'

export const Spotlight = () => {
  const siteStore = useSiteStore()
  const theme = useTheme()
  return (
    <>
      <Above />
      <Stack direction="horizontal">
        <Left />
        <Square
          width={siteStore.sectionHeight * 0.7}
          height={siteStore.sectionHeight * 0.7}
          className="spotlight"
          zIndex={10}
          background={`radial-gradient(circle farthest-side, transparent 0%, ${theme.background})`}
        />
        <Right />
      </Stack>
      <Below />
    </>
  )
}

const Square = gloss(View)

const bg = (theme) => ({ background: theme.background })

const Above = gloss(Box, {
  flex: 1,
  zIndex: 10,
}).theme(bg)

const Below = gloss(Box, {
  flex: 1,
  zIndex: 10,
}).theme(bg)

const Left = gloss(Box, {
  flex: 1,
  zIndex: 10,
}).theme(bg)

const Right = gloss(Box, {
  flex: 1,
  zIndex: 10,
}).theme(bg)
