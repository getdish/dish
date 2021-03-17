import {
  MotionProps,
  View,
  ViewProps,
  useIntersectionObserver,
  useParallaxContainer,
} from '@o/ui'
import { createStoreContext } from '@o/use-store'
import React, { memo, useCallback, useEffect, useRef } from 'react'

import { ParallaxProp, ParallaxStageItem } from './ParallaxStage'

export type FadeInProps = ViewProps & {
  delay?: number
  intersection?: IntersectionObserverInit['rootMargin']
  threshold?: number
  disable?: boolean
  shown?: boolean
}

export const transitions: { [key: string]: MotionProps['transition'] } = {
  slowStiff: {
    type: 'spring',
    damping: 18,
    stiffness: 50,
  },
  slow: {
    type: 'spring',
    damping: 12,
    stiffness: 50,
  },
  slowBouncy: {
    type: 'spring',
    damping: 10,
    stiffness: 40,
  },
  bouncy: {
    type: 'spring',
    damping: 8,
    stiffness: 75,
  },
  normal: {
    type: 'spring',
    damping: 12,
    stiffness: 75,
  },
  fast: {
    type: 'spring',
    damping: 15,
    stiffness: 180,
  },
  fastStatic: {
    duration: 90 / 1000,
  },
}

export const fadeAnimations = {
  down: {
    style: {
      opacity: 0,
      y: -30,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
  },
  up: {
    style: {
      opacity: 0,
      y: 30,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
  },
  right: {
    style: {
      opacity: 0,
      x: 30,
      rotateX: -15,
      rotateY: 15,
      scale: 0.9,
    },
    animate: {
      opacity: 1,
      x: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
    },
  },
  left: {
    style: {
      opacity: 0,
      txys: [-30, 15, -15, 0.9],
      x: -30,
      rotateX: 15,
      rotateY: -15,
      scale: 0.9,
    },
    animate: {
      opacity: 1,
      x: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
    },
  },
}

const FadeStoreContext = createStoreContext(
  class FadeContextStore {
    props: {
      disable: boolean
    }
    shownInternal = false
    pageShown = false

    get shown() {
      return this.pageShown && !this.props.disable && this.shownInternal
    }

    setPageShown() {
      this.pageShown = true
    }

    setShown() {
      this.shownInternal = true
    }
  }
)

export type FadeChildProps = ViewProps & {
  // granular delay, 300, 400, etc
  delay?: number
  // easier delay, 1, 2, 3
  delayIndex?: number
  disable?: boolean
  fullscreen?: boolean
  reverse?: boolean
  min?: number
  max?: number
  parallax?: ParallaxProp
  speed?: number
  offset?: number
}

const initialScreenWidth = window.innerWidth

export const FadeInView = memo(
  ({
    style = fadeAnimations.down.style,
    animate = fadeAnimations.down.animate,
    transition = transitions.normal,
    children,
    delay,
    delayIndex,
    disable,
    fullscreen,
    reverse,
    min,
    max,
    display,
    parallax,
    ...rest
  }: FadeChildProps) => {
    const fadeStore = FadeStoreContext.useStore()
    const shown =
      !disable && (fadeStore.shown !== null ? fadeStore.shown : false)

    const parent = useParallaxContainer()

    style = {
      display: display || 'flex',
      flexDirection: 'column',
      ...style,
      ...(fullscreen && fullscreenStyle),
    }

    // disable animation
    if (disable && animate) {
      style = {
        ...style,
        ...(animate as any),
      }
    }

    if (reverse) {
      // @ts-ignore
      ;[style, animate] = [animate, style]
    }

    const finalTransition =
      initialScreenWidth < 480
        ? { duration: 0 }
        : {
            ...(transition as any),
            delay: delayIndex ? delayIndex / 12 : (delay || 1) / 1000,
          }

    if (parallax) {
      if (!parent) {
        return <View {...rest}>{children}</View>
      }
      return (
        <ParallaxStageItem parallax={parallax} stagger={delayIndex} {...rest}>
          <View
            data-is="FadeChild"
            style={style}
            animate={shown ? animate : undefined}
            transition={finalTransition}
            alignItems="inherit"
            justifyContent="inherit"
            flexDirection="inherit"
            flexFlow="inherit"
            alignSelf="inherit"
            {...rest}
          >
            {children}
          </View>
        </ParallaxStageItem>
      )
    }

    return (
      <View
        data-is="FadeChild"
        style={style}
        animate={shown ? animate : undefined}
        transition={finalTransition}
        {...rest}
      >
        {children}
      </View>
    )
  }
)

const fullscreenStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

export type UseFadePageProps = FadeInProps & { off?: boolean }

// trigger initial animations only after page is ready
const FadeViewListeners = new Set()
let hasLoadedFadeViews = false
export const startFadeViews = () => {
  FadeViewListeners.forEach((x) => x())
  hasLoadedFadeViews = true
}

export const useFadePage = ({
  delay = 0,
  threshold = 0.1,
  off,
  ...props
}: UseFadePageProps = {}) => {
  const ref = useRef(null)
  const store = FadeStoreContext.useCreateStore(
    { disable: props.disable },
    { react: false }
  )

  useEffect(() => {
    if (hasLoadedFadeViews) {
      store.setPageShown()
    } else {
      FadeViewListeners.add(() => {
        store.setPageShown()
      })
    }
  }, [])

  useIntersectionObserver({
    ref,
    options: { threshold: threshold, rootMargin: props.intersection },
    onChange(entries) {
      // only run once
      if (store.shownInternal) return
      const next = entries && entries.some((x) => x.isIntersecting)
      if (next) {
        store.setShown()
      }
    },
  })

  return {
    ref,
    FadeProvide: useCallback(({ children }) => {
      return (
        <FadeStoreContext.ProvideStore value={store}>
          {children}
        </FadeStoreContext.ProvideStore>
      )
    }, []),
  }
}

export const FadeParent = memo(
  ({ children, ...props }: UseFadePageProps & { children?: any }) => {
    const Fade = useFadePage(props)
    return (
      <Fade.FadeProvide>
        <View nodeRef={Fade.ref}>{children}</View>
      </Fade.FadeProvide>
    )
  }
)
