import { AnimationStore, MotionTransform, ParallaxItemProps, ParallaxViewProps } from '@o/ui'
import { CSSPropertySet } from 'gloss'
import * as React from 'react'

import { Page } from './Page'

/**
 * TODO this into Parallax.View itself
 */

const transitionTransforms = {
  'ease-in-out': [
    [-1, -0.2, 0, 0.2, 1],
    [-1, -0.2, 0, 0.2, 1],
  ],
  'ease-in-out-quad': [
    [-1, -0.2, -0.1, 0, 1],
    [-2, -0.1, 0, 0.1, 2],
  ],
  'ease-in': [
    [-1, -0.15, 0, 0.3, 1],
    [-3, 1, 1, 1, 1],
  ],
  'ease-in-quad': [
    [-1, -0.2, -0.1, 0, 1],
    [-2, -0.1, 0, 0, 0],
  ],
  'ease-out': [
    [-1, -0.15, 0, 0.3, 1.5],
    [1, 1, 1, 1, -1.5],
  ],
} as const

export type ParallaxProp =
  | boolean
  | {
      [key in keyof (CSSPropertySet & MotionTransform)]:
        | boolean
        | (ParallaxItemProps & {
            transition?: keyof typeof transitionTransforms
            move?: number
            transform?: (animation: AnimationStore) => AnimationStore
          })
    }

type ParallaxStageItemProps = Omit<ParallaxViewProps, 'parallax'> & {
  parallax?: ParallaxProp
}

const defaultParallax: ParallaxProp = {
  y: {
    move: 125,
    transition: 'ease-in-quad',
    clamp: [-125, 125],
  },
  opacity: {
    transition: 'ease-in',
    clamp: [0, 1],
  },
}

function getParallax(props: ParallaxStageItemProps): ParallaxViewProps['parallax'] {
  if (typeof props.parallax === 'function') {
    return props.parallax
  }
  const parallax =
    props.parallax === true || typeof props.parallax === 'undefined'
      ? defaultParallax
      : props.parallax
  return (geometry) => {
    return Object.keys(parallax).reduce((acc, key) => {
      const { clamp, ...prop } = parallax[key]
      let cur = geometry.useParallaxIntersection({
        relativeTo: 'frame',
        ...props,
        ...prop,
      })

      if (prop.transition) {
        // @ts-ignore
        cur = cur.transform(...transitionTransforms[prop.transition])
      }
      if (prop.move) {
        cur = cur.transform((x) => x * prop.move)
      }
      if (prop.transform) {
        cur = cur.transform(prop.transform)
      }
      if (clamp) {
        cur = cur.transform((x) => {
          return Math.max(clamp[0], Math.min(x, clamp[1]))
        })
      }
      acc[key] = cur
      return acc
    }, []) as any
  }
}

export function ParallaxStageItem(props: ParallaxStageItemProps) {
  return <Page.ParallaxView {...props} parallax={getParallax(props)} />
}

ParallaxStageItem.defaultProps = {
  speed: 1,
  parallax: defaultParallax,
}
