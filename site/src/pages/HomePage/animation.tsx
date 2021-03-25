import { FadeChildProps, fadeAnimations, transitions } from '../../views/FadeInView'
import { allDelay } from './allDelay'

export const animation: {
  [key: string]: FadeChildProps
} = {
  title: {
    delayIndex: allDelay + 0,
  },
  sub1: {
    delayIndex: allDelay + 1,
    ...fadeAnimations.up,
  },
  sub2: {
    delayIndex: allDelay + 2,
    ...fadeAnimations.up,
  },
  join: {
    delayIndex: allDelay + 3,
    ...fadeAnimations.up,
  },
  watch: {
    delayIndex: allDelay + 4,
    ...fadeAnimations.up,
  },
  screen: {
    delayIndex: allDelay + 5,
    ...fadeAnimations.up,
    transition: transitions.slowBouncy,
  },
  blog: {
    delayIndex: allDelay + 16,
    transition: transitions.bouncy,
  },
}
