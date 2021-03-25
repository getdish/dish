import { FullScreen, gloss } from '@o/ui'

export const GradientDown = gloss(FullScreen).theme((theme) => ({
  background: `linear-gradient(transparent, ${theme.background} 65%)`,
}))
