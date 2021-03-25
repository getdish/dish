import { Box, Image, Space, Stack, View, gloss } from '@o/ui'
import React from 'react'

import { mediaQueries } from '../../constants'
import { LogoCircle } from '../../views/DishLogo'
import { FadeInView, useFadePage } from '../../views/FadeInView'
import { wordsWithBrandMark } from '../../views/IntroText'
import { Link } from '../../views/Link'
import { Page } from '../../views/Page'
import { SectionContent } from '../../views/SectionContent'
import { IntroPara } from './IntroPara'

export default function IntroSection() {
  const Fade = useFadePage({
    threshold: 0,
  })

  return (
    <Fade.FadeProvide>
      <Page.BackgroundParallax
        speed={-0.35}
        offset={-0.9}
        x="-5%"
        zIndex={-1}
        opacity={0.5}
        scale={3}
        background="radial-gradient(circle closest-side, #215faa, transparent)"
      />
      <Page.BackgroundParallax
        speed={-0.25}
        offset={0.45}
        x="-5%"
        zIndex={0}
        opacity={0.1}
        scale={0.5}
        background="radial-gradient(circle closest-side, #FFF358, #FFF358 80%, transparent 85%, transparent)"
      />

      <SectionContent
        nodeRef={Fade.ref}
        position="relative"
        padding={['10vh', 0, '10vh']}
        zIndex={10}
      >
        <HalfGrid>
          {/* marginbottom is safari fix */}
          <View belowmd-marginBottom={50}>
            <FadeInView parallax speed={-0.2}>
              <Image
                display="block"
                src={require('../../assets/search.jpg')}
                width="100%"
                abovemd-marginLeft="-30%"
                abovemd-width="130%"
                abovesm-marginLeft="-50%"
                abovesm-width="150%"
                height="auto"
                maxWidth={700}
                margin="auto"
                borderRadius={20}
                maxHeight={500}
                boxShadow={[
                  {
                    spread: 5,
                    blur: 80,
                    color: '#000',
                    y: 20,
                  },
                ]}
              />
            </FadeInView>
          </View>
          <Stack space="xl" justifyContent="center">
            <IntroPara delayIndex={1} stagger={0} size={2.3} sizeLineHeight={1.2}>
              <strong style={{ color: '#e61277' }}>A hitchhikers guide to earth</strong>
              &nbsp;would be nice, wouldn't it?
            </IntroPara>
            <IntroPara size={1.7} fontWeight="600" delayIndex={2} stagger={-0.5}>
              <span style={{ color: '#249be9' }}>
                We want to find better quality food, and more,
              </span>{' '}
              like the best pho or tacos in our city. So we index sentiment from reviews and sources
              across the web.
            </IntroPara>
            {/* <Link href="/"> */}
            <IntroPara alpha={0.65} delayIndex={3} stagger={-1}>
              But we need a great community. So we're giving back to users with DishCoin. More on
              that below. &nbsp;&nbsp;&nbsp;&nbsp;
              <LogoCircle scale={0.65} />
            </IntroPara>
            {/* </Link> */}
          </Stack>
        </HalfGrid>
      </SectionContent>
    </Fade.FadeProvide>
  )
}

const HalfGrid = gloss(Box, {
  display: 'grid',
  columnGap: 50,

  [mediaQueries.abovemd]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
})
