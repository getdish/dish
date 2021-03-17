import { gloss, InlineFlex } from 'gloss'

export const LinkText = gloss(InlineFlex, {
  userSelect: 'none',
  transform: {
    y: 0.5,
  },
  '& a': {
    textDecoration: 'none',
  },
})
