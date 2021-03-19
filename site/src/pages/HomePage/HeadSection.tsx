import {
  Icon,
  Image,
  Parallax,
  SimpleText,
  SimpleTextProps,
  Space,
  Stack,
  SurfacePassProps,
  Theme,
  View,
  gloss,
} from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import { Flex } from 'gloss'
import React, { memo } from 'react'

import { fontProps } from '../../constants'
import { useSiteStore } from '../../SiteStore'
import { FadeInView, fadeAnimations, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { SectionContentChrome } from '../../views/SectionContent'
import { animation } from './animation'
import { Join } from './Join'
import { WelcomeBlogPostButton } from './WelcomeBlogPostButton'

const Star = gloss(Flex, {
  borderRadius: 100,
  width: 2,
  height: 2,
  background: 'rgba(255,255,255,0.48)',
  position: 'absolute',
  boxShadow: [
    {
      spread: 0,
      blur: 15,
      color: 'rgba(255,255,255,0.5)',
      x: 0,
      y: 0,
    },
  ],
})

export function HeadSection() {
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const Fade = useFadePage({
    threshold: 0,
  })

  return (
    <Fade.FadeProvide>
      <Page.BackgroundParallax
        speed={-0.35}
        offset={-1}
        zIndex={-1}
        opacity={0.3}
        scale={1.5}
        top="-70%"
        background="radial-gradient(circle closest-side, #1D4B84, transparent)"
      />

      <Page.ParallaxView
        className="stars"
        speed={1}
        position="absolute"
        width="50%"
        height="50%"
        top="3%"
        right="-80%"
        parallax={(geometry) => ({
          x: geometry.useParallax().transform((x) => -x * 3),
          y: geometry.useParallax().transform((x) => x * 3),
        })}
      >
        <Star top="0%" left="0%" />
        <Star top="20%" left="20%" />
        <Star top="50%" left="80%" />
        <Star top="0%" left="30%" />
        <Star top="0%" left="80%" />
      </Page.ParallaxView>

      <Page.ParallaxView
        className="stars"
        speed={1}
        position="absolute"
        width="50%"
        height="50%"
        top="0%"
        right="-80%"
        parallax={(geometry) => ({
          x: geometry.useParallax().transform((x) => -x * 3 * 1.2),
          y: geometry.useParallax().transform((x) => x * 3 * 1.2),
        })}
      >
        <Star top="0%" left="0%" />
        <Star top="20%" left="20%" />
        <Star top="50%" left="80%" />
        <Star top="0%" left="30%" />
        <Star top="0%" left="80%" />
      </Page.ParallaxView>

      <Stack
        opacity={fontsLoaded ? 1 : 0}
        margin={['auto', 0]}
        height="calc(100% - 100px)"
      >
        <Space size="xxl" />
        <Stack
          maxHeight="80vh"
          minHeight={600}
          sm-minHeight="auto"
          nodeRef={Fade.ref}
          alignItems="center"
          justifyContent="center"
        >
          <HeadTextSection />
        </Stack>
        <View
          className="app-screenshot"
          position="relative"
          height={500}
          flex={7}
          margin={['-20%', '-10%', -100]}
          userSelect="none"
          zIndex={-1}
        >
          <Parallax.View speed={-0.3}>
            <FadeInView speed={1} {...animation.screen}>
              <View
                transform={{
                  perspective: 10000,
                  rotateY: '15deg',
                  rotateX: '58deg',
                  rotateZ: '-22deg',
                  scale: 1.2,
                }}
              >
                <Image
                  display="block"
                  src={require('../../assets/dish.jpg')}
                  width="auto"
                  height={500}
                  maxWidth={1200}
                  margin="auto"
                />
              </View>
            </FadeInView>
          </Parallax.View>
        </View>
      </Stack>
    </Fade.FadeProvide>
  )
}

const scale = 0.8

const para = {
  display: 'flex',
  fontSize: `${3.4 * scale}vw`,
  lineHeight: `${5.1 * scale}vw`,
  'lg-fontSize': 38 * scale,
  'lg-lineHeight': `${3.2 * scale}rem`,
  'sm-fontSize': 22 * scale,
  'sm-lineHeight': `${2.8 * scale}rem`,
  'sm-display': 'inline',
  fontWeight: 300,
  'abovemd-fontWeight': 300,
} as const

const scaleSm = 0.4

const paraSmall = {
  display: 'flex',
  fontSize: `${3.4 * scaleSm}vw`,
  lineHeight: `${5.1 * scaleSm}vw`,
  'lg-fontSize': 38 * scaleSm,
  'lg-lineHeight': `${3.2 * scaleSm}rem`,
  'sm-fontSize': 22 * scaleSm,
  'sm-lineHeight': `${2.8 * scaleSm}rem`,
  'sm-display': 'inline',
  fontWeight: 300,
  'abovemd-fontWeight': 300,
} as const

const HeadTextSection = memo(() => {
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const measured = fontsLoaded
  // const pFit = useTextFit({ min: 16, updateKey: fontsLoaded })
  const br = <View className="head-space" height={40} sm-height={15} />
  const sectionHeight = useSiteStore().sectionHeight

  return (
    <SectionContentChrome>
      <View
        className="head-text-section"
        minHeight={sectionHeight}
        textAlign="center"
        alignItems="center"
        justifyContent="center"
        zIndex={10}
        marginTop={100}
        position="relative"
      >
        <View width="100%" alignItems="center">
          <TextFitTitle
            fontWeight={100}
            alignSelf="center"
            selectable
            textAlign="center"
            whiteSpace="nowrap"
            maxHeight={260}
          >
            <FadeInView
              disable={!measured}
              {...animation.title}
              {...fontProps.TitleFont}
            >
              your pokédex for the real world
            </FadeInView>
          </TextFitTitle>
          {br}
          <span style={{ userSelect: 'none' }}>&nbsp;</span>
          <View sm-display="none">
            <FadeInView {...animation.sub2} minHeight="min-content">
              <Paragraph
                size={1.8}
                sizeLineHeight={1.6}
                maxWidth={710}
                fontWeight={300}
              >
                Curating a better map of the world together.
                <br />{' '}
                <span style={{ color: '#feac1f' }}>
                  {' '}
                  Designed to last: non-profit, with a community token.
                </span>
              </Paragraph>
            </FadeInView>
          </View>
          {br}
          <View
            display="block"
            minHeight="min-content"
            sm-display="inline"
            marginTop={10}
            position="relative"
          >
            <HeadJoin />
          </View>
        </View>
      </View>
    </SectionContentChrome>
  )
})

const HeadJoin = memo(() => {
  return (
    <View flex={1} width="100%" alignItems="center">
      <FadeInView {...fadeAnimations.up} delay={500}>
        <SurfacePassProps elevation={5} {...fontProps.TitleFont}>
          <Theme name="orbitOneDark">
            <Theme scale={1.2} sm-scale={1}>
              <Join
                inputProps={{
                  minWidth: 300,
                  'sm-minWidth': 'auto',
                  textAlign: 'left',
                }}
                borderRadius={1000}
                boxShadow={[[0, 5, 40, [0, 0, 0, 0.15]]]}
                flexDirection="row"
                group
                space={false}
              />
            </Theme>
          </Theme>
        </SurfacePassProps>
      </FadeInView>
    </View>
  )
})

const titleSize = 6

const TextFitTitle = gloss(SimpleText, {
  userSelect: 'text',
  lineHeight: '95%',
  fontSize: `${titleSize}vw`,
  'lg-fontSize': titleSize * 10,
})

const TitleParagraph = (props: SimpleTextProps) => {
  return <Paragraph alpha={0.7} xs-display="inline" {...props} />
}
