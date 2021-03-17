import React, { memo } from 'react'

import { LinkState } from '../LinkState'
import { fadeAnimations, FadeInView, transitions } from './FadeInView'
import { HeaderContext } from './HeaderContext'
import { Link } from './Link'

export const HeaderLink = memo(({ delay, children, ...props }: any) => {
  const header = HeaderContext.useStore()
  const leaving = header && header.shown === false
  return (
    <Link
      width="33%"
      fontWeight={400}
      fontSize={window.location.pathname === '/' ? 18 : 16}
      lineHeight="1.25rem"
      {...props}
    >
      <FadeInView
        disable={!LinkState.didAnimateOut}
        delay={leaving ? 0 : delay}
        reverse={leaving}
        {...(leaving ? fadeAnimations.up : fadeAnimations.down)}
        transition={leaving ? transitions.fastStatic : transitions.fast}
      >
        {children}
      </FadeInView>
    </Link>
  )
})

const linkDelay = 80

export const LinksLeft = props => {
  return (
    <>
      {/* <HeaderLink delay={linkDelay * 1} {...props} href="/guides">
        Guides
      </HeaderLink>
      <HeaderLink delay={linkDelay * 2} {...props} href="/docs">
        Docs
      </HeaderLink>
      <HeaderLink delay={linkDelay * 3} {...props} href="/apps">
        Apps
      </HeaderLink> */}
    </>
  )
}

export const LinksRight = props => (
  <>
    {/* <HeaderLink delay={linkDelay * 4} {...props} href="/beta">
      Beta
    </HeaderLink>
    <HeaderLink delay={linkDelay * 5} {...props} href="/blog">
      Blog
    </HeaderLink>
    <HeaderLink delay={linkDelay * 6} {...props} href="/about">
      About
    </HeaderLink> */}
  </>
)
