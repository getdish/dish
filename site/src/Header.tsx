import { BorderBottom, Stack, ViewProps } from '@o/ui'
import { Box, gloss, useTheme } from 'gloss'
import React, { memo, useLayoutEffect, useRef, useState } from 'react'

import { useScreenSize } from './hooks/useScreenSize'
import { LinkState } from './LinkState'
import { useSiteStore } from './SiteStore'
import { FadeInView, transitions, useFadePage } from './views/FadeInView'
import { HeaderContain, LinkSection } from './views/HeaderContain'
import { HeaderContext } from './views/HeaderContext'
import { LinksLeft, LinksRight } from './views/HeaderLink'
import { LogoHorizontal } from './views/LogoHorizontal'
import { LogoVertical } from './views/LogoVertical'

export type HeaderProps = {
  slim?: boolean
  noBorder?: boolean
  before?: React.ReactNode
  logoProps?: ViewProps
}

export const Header = memo(({ slim, noBorder, before, logoProps, ...rest }: HeaderProps) => {
  const theme = useTheme()
  const siteStore = useSiteStore()
  const headerStore = HeaderContext.useCreateStore()
  // only animate once
  const [shown, setShown] = useState(false)
  const Fade = useFadePage({ shown, threshold: 0 })

  useScreenSize({
    onChange(size) {
      const next = size === 'small' ? siteStore.showSidebar : true
      setShown(last => {
        // only update once
        if (last === true) return true
        headerStore.setShown(next)
        return next
      })
    },
  })

  const linksLeft = (
    <LinkSection md-display="none" alignRight>
      <LinkRow>
        <LinksLeft />
      </LinkRow>
    </LinkSection>
  )

  const linksRight = (
    <LinkSection md-display="none">
      <LinkRow>
        <LinksRight />
      </LinkRow>
    </LinkSection>
  )

  return (
    <HeaderContext.ProvideStore value={headerStore}>
      {/* large */}
      <Fade.FadeProvide>
        {!slim && (
          <Stack
            direction="horizontal"
            nodeRef={Fade.ref}
            position="absolute"
            top={0}
            left={0}
            right={0}
            zIndex={1000000}
            alignItems="center"
            justifyContent="space-around"
            padding={[30, 0]}
            opacity={slim ? 0 : 1}
            pointerEvents={slim ? 'none' : 'auto'}
            {...rest}
          >
            <HeaderContain>
              {linksLeft}
              <FadeInView
                disable={!LinkState.didAnimateOut}
                transition={shown ? transitions.normal : transitions.fastStatic}
                delay={shown ? 100 : 0}
              >
                <LogoVertical />
              </FadeInView>
              {linksRight}
            </HeaderContain>
          </Stack>
        )}

        {before}

        {slim && (
          <Stack
            direction="horizontal"
            nodeRef={Fade.ref}
            pointerEvents="auto"
            background={theme.background}
            position="relative"
            zIndex={1000000}
            opacity={slim ? 1 : siteStore.showSidebar ? 0 : 1}
            {...rest}
          >
            <HeaderContain height={42}>
              {linksLeft}
              <FadeInView
                disable={!LinkState.didAnimateOut}
                transition={shown ? transitions.normal : transitions.fastStatic}
                delay={shown ? 0 : 0}
              >
                <LogoHorizontal slim {...logoProps} />
              </FadeInView>
              {linksRight}
            </HeaderContain>
            {!noBorder && <BorderBottom opacity={0.5} />}
          </Stack>
        )}
      </Fade.FadeProvide>
    </HeaderContext.ProvideStore>
  )
})

const LinkRow = gloss(Box, {
  flexDirection: 'row',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000000000,
  position: 'relative',
})
