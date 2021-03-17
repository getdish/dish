import { Button, ErrorBoundary, FullScreen, Portal, scrollTo, Theme, Title, View } from '@o/ui'
import { useForceUpdate } from '@o/use-store'
import { isDefined } from '@o/utils'
import { throttle } from 'lodash'
import React, { memo, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { NotFoundBoundary, useCurrentRoute, useLoadingRoute } from 'react-navi'

import { Header } from './Header'
import { useScreenSize } from './hooks/useScreenSize'
import { useSiteStore } from './SiteStore'
import { themes } from './themes'
import { BusyIndicator } from './views/BusyIndicator'
import { useFadePage } from './views/FadeInView'
import { HeaderLink, LinksLeft, LinksRight } from './views/HeaderLink'

const transition = 'transform ease 300ms'

let updateLayout = null

export const usePageTheme = () => {
  const [setTheme, setNext] = useState()
  const route = useCurrentRoute()
  const curView = route.views.find(x => x && x.type && x.type.theme)
  const key = `theme-${route.url.pathname.split('/')[1] || ''}`
  const theme = setTheme || (curView && curView.type && curView.type.theme) || 'home'
  return [
    theme,
    useCallback(
      next => {
        setNext(prev => {
          if (prev !== next) {
            console.log('setting theme', next, prev)
            updateLayout()
            return next
          }
          return prev
        })
      },
      [key],
    ),
  ]
}

const PageLoading = memo(() => {
  const loadingRoute = useLoadingRoute()
  return <BusyIndicator color="#FE5C58" isBusy={!!loadingRoute} delayMs={50} />
})

export const Layout = memo((props: any) => {
  console.warn('layout is rendering')
  const forceUpdate = useForceUpdate()
  // ^^^
  // for some reason literally just having *any* useState/useEffect causes this to render twice on mount.... but not other components
  // even if its empty and just has a single useForceUpdate
  // try it, uncomment this and then try with/without forceUpdate:
  // console.log('rendering layout'); return <div />;
  updateLayout = forceUpdate
  const siteStore = useSiteStore()
  const sidebarWidth = 300
  const route = useCurrentRoute()
  const [theme] = usePageTheme()

  useScreenSize({
    onChange(size) {
      siteStore.screenSize = size
    },
  })

  useEffect(() => {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        scrollTo(window.location.hash)
      }
    }
  }, [route])

  useEffect(() => {
    window.addEventListener(
      'resize',
      throttle(() => {
        siteStore.windowHeight = window.innerHeight
      }, 64),
    )
  }, [])

  const maxHeight = siteStore.showSidebar ? window.innerHeight : siteStore.maxHeight

  useLayoutEffect(() => {
    // @ts-ignore
    const background = (themes[theme].bodyBackground || themes[theme].background).toString()
    document.body.style.background = background
  }, [theme])

  return (
    <Theme name={theme}>
      <PageLoading />
      <PeekHeader isActive={route.views.some(x => x.type && x.type.showPeekHeader)} />
      {/* small */}
      <Theme name="home">
        <Button
          className="sidebar-open-button"
          abovemd-display="none"
          pointerEvents="auto"
          position="fixed"
          top={-3}
          right={10}
          zIndex={1000000000}
          icon="menu"
          color="#999"
          iconSize={16}
          size={2}
          chromeless
          onClick={siteStore.toggleSidebar}
        />
      </Theme>
      <View
        className={`view-layout layout-theme-${theme}`}
        minHeight="100vh"
        minWidth="100vw"
        overflow={isDefined(maxHeight) ? 'hidden' : 'visible'}
        transition={transition}
        style={{
          maxHeight,
          // WARNING dont have translate here it ruins sticky sidebar
          transform: siteStore.showSidebar ? `translateX(${-sidebarWidth}px)` : ``,
        }}
      >
        <ErrorBoundary name="Site Error">
          <NotFoundBoundary render={NotFound}>{props.children}</NotFoundBoundary>
        </ErrorBoundary>
      </View>
      <LayoutSidebar />
    </Theme>
  )
})

const LayoutSidebar = memo(() => {
  const siteStore = useSiteStore()
  const sidebarWidth = 300
  const Fade = useFadePage()

  const linkProps = {
    width: '100%',
    padding: 20,
    fontSize: 22,
    textAlign: 'left',
    onMouseUp: () => {
      siteStore.toggleSidebar()
    },
  }

  return (
    <Portal prepend style={{ zIndex: 100000000 }}>
      <Theme name="home">
        <View
          nodeRef={Fade.ref}
          pointerEvents="auto"
          position="fixed"
          top={0}
          right={0}
          height="100vh"
          transition={transition}
          background={bg}
          style={{
            width: sidebarWidth,
            transform: `translateX(${siteStore.showSidebar ? 0 : sidebarWidth}px)`,
          }}
        >
          {/* <Button
            position="absolute"
            top={20}
            right={20}
            chromeless
            icon="cross"
            iconSize={16}
            zIndex={1000}
            cursor="pointer"
            onClick={siteStore.toggleSidebar}
          /> */}
          <Fade.FadeProvide>
            <HeaderLink href="/" {...linkProps}>
              Home
            </HeaderLink>
            <LinksLeft {...linkProps} />
            <LinksRight {...linkProps} />
          </Fade.FadeProvide>
        </View>
      </Theme>
    </Portal>
  )
})

const bg = theme => theme.background

function NotFound() {
  return (
    <View>
      <Title>Not found</Title>
    </View>
  )
}

const PeekHeader = memo((props: { isActive?: boolean }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = document.documentElement

    let top = el.scrollTop
    let direction: 'down' | 'up' = 'down'

    const onScroll = throttle(() => {
      const next = el.scrollTop
      direction = next >= top ? 'down' : 'up'

      // avoid small moves
      const diff = direction === 'down' ? next - top : top - next
      if (diff < 100) {
        return
      }

      top = next

      if (direction === 'up' && top > 300) {
        setShow(true)
      } else {
        setShow(false)
      }
    }, 100)

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  if (!props.isActive) {
    return null
  }

  return (
    <Theme name="home">
      <FullScreen
        zIndex={100000000}
        position="fixed"
        bottom="auto"
        transition="all ease 200ms"
        opacity={show ? 1 : 0}
        transform={{ y: show ? 0 : -40 }}
        pointerEvents={show ? 'auto' : 'none'}
        className="peek-header"
      >
        <Header
          slim
          boxShadow={[[0, 0, 30, [0, 0, 0, 1]]]}
          logoProps={{
            onClick(e) {
              e.preventDefault()
              scrollTo(0)
            },
          }}
        />
      </FullScreen>
    </Theme>
  )
})
