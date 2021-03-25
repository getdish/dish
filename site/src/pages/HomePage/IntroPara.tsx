import React from 'react'

import { FadeInView } from '../../views/FadeInView'
import { Paragraph } from '../../views/Paragraph'

export const IntroPara = ({ delayIndex, stagger, ...props }) => (
  <FadeInView parallax delayIndex={delayIndex} stagger={stagger}>
    <Paragraph alpha={0.85} size={1.4} fontWeight={400} sizeLineHeight={1.4} {...props} />
  </FadeInView>
)
