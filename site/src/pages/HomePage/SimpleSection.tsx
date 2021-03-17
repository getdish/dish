import { gloss, Icon, Space, Stack, View } from '@o/ui'
import { isDefined } from '@o/utils'
import { Box } from 'gloss'
import React from 'react'

import { fadeAnimations, FadeInView } from '../../views/FadeInView'
import { Paragraph } from '../../views/Paragraph'
import { TitleText } from '../../views/TitleText'

const titleFont = {
  WebkitTextFillColor: 'transparent',
  background: 'linear-gradient(to right, #B65138, #BE0DBE)',
  backgroundSize: '300',
}

export const SimpleSection = ({ delay = 100, index = undefined, title, children, ...rest }) => {
  const isLeft = isDefined(index) && index % 2 === 0
  return (
    <SectionChrome space abovesm-margin={[0, 15, 15, 0]} {...rest}>
      <FadeInView {...(isLeft ? fadeAnimations.right : fadeAnimations.left)} delay={delay}>
        <SectionTitle>
          {isDefined(index) && (
            <Badge opacity={0} lg-opacity={1}>
              <BadgeText>{index}.</BadgeText>
            </Badge>
          )}
          <TitleText
            style={{
              WebkitBackgroundClip: 'text',
            }}
            {...titleFont}
            size="xs"
            textAlign="left"
            flex={1}
            fontWeight={400}
          >
            {title}
          </TitleText>
        </SectionTitle>
        <Space />
        <Box>{children}</Box>
      </FadeInView>
    </SectionChrome>
  )
}

const SectionChrome = gloss(Stack, {
  position: 'relative',
})

export const SectionP = props => (
  <Paragraph
    tagName="div"
    display="flex"
    flexDirection="row"
    size={1.25}
    fontWeight={400}
    sizeLineHeight={1.2}
    {...props}
  />
)

export const SectionIcon = gloss(Icon, {
  size: 20,
  margin: [4, 20, 4, 0],
})

const SectionTitle = gloss(View, {
  flexDirection: 'row',
  flex: 1,
  maxWidth: '80%',
})

const Badge = gloss(View, {
  position: 'absolute',
  // top: -50,
  transform: {
    x: 'calc(-100% - 15px)',
    y: -18,
  },
  width: 55,
  height: 55,
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
}).theme(theme => ({
  // color: theme.color.setAlpha(0.5),
  // border: [1, theme.color.setAlpha(0.1)],
}))

const BadgeText = gloss(Box, {
  transform: {
    y: '15%',
    x: '55%',
  },
})
