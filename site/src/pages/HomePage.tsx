import { ErrorBoundary, Loading, Theme, useIntersectionObserver } from '@o/ui'
import { once } from 'lodash'
import React, { Suspense, lazy, memo, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { requestIdleCallback } from '../etc/requestIdle'
import { Header } from '../Header'
import { startFadeViews } from '../views/FadeInView'
import { Page } from '../views/Page'
import { SectionContent } from '../views/SectionContent'
import FeaturesSection from './HomePage/FeaturesSection'
import { HeadSection } from './HomePage/HeadSection'
import IntroSection from './HomePage/IntroSection'
import { LoadingPage } from './LoadingPage'

const Sections = {
  AllInOnePitchDemoSection: loadOnIntersect(
    lazy(() => retry(() => import('./HomePage/AllInOnePitchDemoSection')))
  ),
  FeaturesSection: loadOnIntersect(lazy(() => retry(() => import('./HomePage/FeaturesSection')))),
  FooterSection: loadOnIntersect(lazy(() => retry(() => import('./HomePage/FooterSection')))),
  DataAppKitFeaturesSection: loadOnIntersect(
    lazy(() => retry(() => import('./HomePage/DataAppKitFeaturesSection')))
  ),
  MissionMottoSection: loadOnIntersect(
    lazy(() => retry(() => import('./HomePage/MissionMottoSection')))
  ),
}

const props = {
  maxHeight: 1400,
  height: '85vh',
  minHeight: 'max-content',
}

let hasLoadedOnce = false
setTimeout(() => {
  hasLoadedOnce = true
}, 100)

export const HomePage = memo(() => {
  let [loading, setLoading] = useState(!hasLoadedOnce)

  useLayoutEffect(() => {
    if (hasLoadedOnce) return
    onLoadAllImages().then(() => {
      window['requestIdleCallback'](() => {
        setLoading(false)
        hasLoadedOnce = true
        setTimeout(() => {
          startFadeViews()
        }, 20)
      })
    })
  }, [])

  return (
    <>
      <LoadingPage loading={loading} />
      <Header />
      <main
        className="main-contents"
        style={{ position: 'relative', zIndex: 0, overflow: 'hidden' }}
      >
        <Page {...props} height="auto" zIndex={0}>
          <HeadSection />
        </Page>
        <Page {...props}>
          <IntroSection />
        </Page>
        <Page {...props}>
          <Sections.DataAppKitFeaturesSection />
        </Page>
        <Page {...props} maxHeight={1000}>
          <FeaturesSection />
        </Page>
        <Page {...props}>
          <Sections.AllInOnePitchDemoSection />
        </Page>
        <Page {...props}>
          <Sections.MissionMottoSection />
        </Page>
        <Page {...props} maxHeight={600}>
          <Theme name="home">
            <Sections.FooterSection hideJoin />
          </Theme>
        </Page>
      </main>
    </>
  )
})

// @ts-ignore
HomePage.theme = 'home'
// @ts-ignore
HomePage.showPeekHeader = true

let allUpcoming = []

const onIdle = () => new Promise((res) => requestIdleCallback(res))

const startLoading = once(async () => {
  // let them all add
  await new Promise((res) => setTimeout(res, 4000))
  // load rest of page
  while (allUpcoming.length) {
    await onIdle()
    const next = allUpcoming.reduce((a, b) => (b.top < a.top ? b : a), {
      top: Infinity,
    })
    next.load()
    allUpcoming.splice(
      allUpcoming.findIndex((x) => x.load === next.load),
      1
    )
  }
})

function loadOnIntersect(Component: any) {
  return (props) => {
    const [show, setShow] = useState(false)
    const ref = useRef(null)

    useIntersectionObserver({
      ref,
      options: { threshold: 0 },
      onChange(entries) {
        if (entries && entries[0].isIntersecting === true && !show) {
          setShow(true)
        }
      },
    })

    // preload them when ready
    // or load the previous when its above
    useLayoutEffect(() => {
      const top = ref.current.getBoundingClientRect().y
      // because we have auto sized heights we load everything above immediately
      if (document.documentElement.scrollTop > top) {
        setShow(true)
      } else {
        allUpcoming.push({
          top,
          load: () => setShow(true),
        })
        startLoading()
      }
    }, [])

    const fallback = (
      <SectionContent flex="none" {...props}>
        <div
          className="intersect-div"
          style={{
            display: 'flex',
            zIndex: 1000000000000,
            // background: 'red',
            width: 2,
            position: 'absolute',
            // makes it load "before/after" by this px
            top: -200,
            bottom: -200,
          }}
          ref={ref}
        />
        <Loading />
      </SectionContent>
    )

    return (
      <ErrorBoundary name={`${Component.name}`}>
        <Suspense fallback={fallback}>{show ? <Component {...props} /> : fallback}</Suspense>
      </ErrorBoundary>
    )
  }
}

function retry<A>(fn, retriesLeft = 5, interval = 1000) {
  return new Promise<A>((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            console.log('maximum retries exceeded', fn)
            reject(error)
            return
          }
          // Passing on "reject" is the important part
          retry(fn, retriesLeft - 1, interval).then((x) => resolve(x as A), reject)
        }, interval)
      })
  })
}

function onLoadAllImages() {
  return new Promise((res) => {
    let imgs = Array.from(document.images).filter((x) => !x.complete)
    let len = imgs.length
    let counter = 0

    if (!len) return res()

    for (const img of imgs) {
      img.addEventListener('load', incrementCounter, false)
    }

    function incrementCounter() {
      counter++
      if (counter === len) {
        res()
      }
    }
  })
}
