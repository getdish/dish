import {
  AnimatePresence,
  Button,
  Image,
  Space,
  Stack,
  View,
  animation,
  gloss,
} from '@o/ui'
import { Box, Inline } from 'gloss'
import React, { memo, useState } from 'react'

import { mediaStyles } from '../../constants'
// import listScreen from '../../public/images/screen-list.jpg'
// import tableScreen from '../../public/images/screen-table.jpg'
import { linkProps } from '../../useLink'
import {
  FadeInView,
  fadeAnimations,
  transitions,
  useFadePage,
} from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButton } from '../../views/PillButton'
import { PillButtonDark } from '../../views/PillButtonDark'
import { TiltSquircle } from '../../views/Squircle'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

const SubSection = (props) => (
  <View minWidth={200} alignItems="center" padding={['sm', true]} {...props} />
)

const Dot = gloss(Box, {
  borderRadius: 100,
  width: 9,
  height: 9,
  border: [5, 'transparent'],
  margin: [0, 10],
  background: [255, 255, 255, 0.5],
  opacity: 0.5,
  cursor: 'pointer',
  transition: 'all ease 300ms',

  hoverStyle: {
    opacity: 0.8,
  },

  activeStyle: {
    opacity: 1,
  },
})

const CenterText = (props) => (
  <Paragraph
    {...{
      selectable: true,
      sizeLineHeight: 1.2,
      size: 1.15,
      alpha: 0.68,
      textAlign: 'center',
    }}
    {...props}
  />
)

const FlexView = gloss(View, {
  position: 'relative',
  flex: 1,
})

const elements = [
  {
    // iconBefore: require('../../public/logos/slack.svg'),
    title: 'Table',
    body: `The table that has it all. Virtualized, resizable, sortable, filterable, multi-selectable, and more. With easy sharing to forms, lists, or other apps in Orbit.`,
    // image: tableScreen,
    // iconAfter: require('../../public/logos/gmail.svg'),
    afterName: 'Gmail',
    beforeName: 'Slack',
    link: '/docs/table',
  },
  {
    // iconBefore: require('../../public/logos/postgres.svg'),
    title: 'List',
    body: `Every list in Orbit accepts the same props as tables. They are incredibly powerful, virtualized, and can group, filter, search, and share with a prop.`,
    // image: listScreen,
    // iconAfter: require('../../public/logos/jira.svg'),
    afterName: 'Jira',
    beforeName: 'Postgres',
    link: '/docs/list',
  },
  {
    // iconBefore: require('../../public/logos/medium.svg'),
    title: 'Grid',
    body: `Orbit Grids automatically persist their state. They can be easily arranged and resized and plugging in data is as easy as nesting an <AppCard />.`,
    // image: listScreen,
    // iconAfter: require('../../public/logos/sheets.svg'),
    afterName: 'GSheets',
    beforeName: 'Crawler',
    link: '/docs/grid',
  },
]

const variants = {
  enter: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
}

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

export default memo(() => {
  const Fade = useFadePage()

  const [[page, direction], setPage] = useState([0, 0])
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }
  const goTo = (page: number) => {
    setPage([page, page > page[0] ? 1 : -1])
  }
  const index = animation.wrap(0, elements.length, page)

  return (
    <Fade.FadeProvide>
      {/* pink left */}
      <Page.BackgroundParallax
        speed={-0.5}
        offset={0.3}
        x="-65%"
        scale={1.8}
        className="glow-one"
        opacity={0.4}
        background="radial-gradient(circle closest-side, #D25CCD, transparent)"
      />

      {/* pink left */}
      <Page.BackgroundParallax
        speed={-0.2}
        offset={0}
        scale={2.2}
        x="50%"
        opacity={0.1}
        background="radial-gradient(circle closest-side, #0C0DA7, transparent)"
        parallax={(geometry) => ({
          y: geometry.useParallax(),
          x: geometry.useParallax().transform((x) => x * 1 - 240),
        })}
      />

      <SpacedPageContent
        nodeRef={Fade.ref}
        padding={['10vh', '0%']}
        header={
          <>
            <FadeInView parallax delayIndex={0}>
              <PillButton>Build</PillButton>
            </FadeInView>
            <FadeInView parallax delayIndex={1}>
              <TitleText textAlign="center" size="xxxl">
                Earn, curate, enjoy
              </TitleText>
            </FadeInView>
            <TitleTextSub margin="auto" minWidth={320}>
              <FadeInView parallax sm-display="inline" delayIndex={2}>
                When building a better food search app, we realized we needed to
                think differently. How do you sustain high quality? It's all in
                the community.
              </FadeInView>
            </TitleTextSub>
          </>
        }
      >
        <Stack
          minWidth={300}
          maxWidth="100%"
          margin={[0, 'auto', 0]}
          sm-margin={0}
        >
          <Space />

          <Stack direction="horizontal" space>
            <FlexView
              className="test-me-out"
              flex={2}
              alignItems="center"
              position="relative"
              margin={0}
              sm-margin={[0, '-5%']}
            >
              <FadeInView
                parallax
                width="100%"
                delayIndex={6}
                {...fadeAnimations.up}
              >
                <Button
                  coat="flat"
                  cursor="pointer"
                  size={1.5}
                  iconSize={20}
                  circular
                  zIndex={100}
                  position="absolute"
                  top={-10}
                  left={5}
                  icon="chevron-left"
                  onClick={() => paginate(-1)}
                />
                <Button
                  coat="flat"
                  cursor="pointer"
                  size={1.5}
                  iconSize={20}
                  circular
                  zIndex={100}
                  position="absolute"
                  top={-10}
                  right={5}
                  icon="chevron-right"
                  onClick={() => paginate(1)}
                />
              </FadeInView>

              <FadeInView
                parallax
                {...fadeAnimations.up}
                delayIndex={5}
                marginBottom={-100}
                zIndex={10}
              >
                <TiltSquircle
                  {...linkProps(elements[index].link)}
                  tagName="div"
                  width={280}
                  height={280}
                  background={`linear-gradient(125deg, #78009F, #4C1966)`}
                  boxShadow="0 20px 70px rgba(0,0,0,0.8)"
                  padding={30}
                  cursor="pointer"
                  key={`squircle-${page}`}
                  custom={direction}
                  variants={variants}
                >
                  <TitleText
                    fontSize={18}
                    margin={[0, 'auto']}
                    letterSpacing={2}
                    alpha={0.4}
                    textTransform="uppercase"
                    color="#fff"
                    cursor="inherit"
                  >
                    {`<${elements[index].title} />`}
                  </TitleText>
                  <Space />
                  <Paragraph
                    cursor="inherit"
                    sizeLineHeight={1.2}
                    size={1.2}
                    alpha={0.8}
                  >
                    {elements[index].body}
                  </Paragraph>
                </TiltSquircle>
              </FadeInView>
            </FlexView>

            <FlexView alignItems="center" sm-display="none">
              <FadeInView parallax {...fadeAnimations.right} delayIndex={4}>
                <Image
                  userSelect="none"
                  alignSelf="center"
                  width={80}
                  height={80}
                  key={`iconAfter-${page}`}
                  custom={direction}
                  variants={variants}
                  src={elements[index].iconAfter}
                />
              </FadeInView>
              <Space size="xxl" />
              <FadeInView parallax delayIndex={5} alignSelf="flex-start">
                <Image
                  key={`arrowAfter-${page}`}
                  custom={direction}
                  variants={variants}
                  userSelect="none"
                  opacity={0.5}
                  transform={{
                    rotate: '275deg',
                    scale: 0.5,
                  }}
                  src={require('../../public/images/curve-arrow.svg')}
                />
              </FadeInView>
            </FlexView>
          </Stack>

          <FadeInView
            parallax
            delayIndex={8}
            flexFlow="row"
            margin={[42, 'auto', 0]}
          >
            {[0, 1, 2].map((x) => (
              <Dot
                key={`dot-${x}`}
                active={x === index}
                onClick={() => goTo(x)}
              />
            ))}
          </FadeInView>
        </Stack>
      </SpacedPageContent>
    </Fade.FadeProvide>
  )
})
