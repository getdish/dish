import { Image, Parallax, Space, Stack, Tooltip, View } from '@o/ui'
import React from 'react'

import appScreenshot from '../../public/images/app-screenshot.jpg'
import arrow from '../../public/images/callout-arrow.svg'
import codeScreenshot from '../../public/images/code-screenshot.jpg'
import { fadeAnimations, FadeInView, useFadePage } from '../../views/FadeInView'
import { Link } from '../../views/Link'
import { Page } from '../../views/Page'
import { ParagraphIntro } from '../../views/ParagraphIntro'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { Item } from './Item'
import { SpacedPageContent } from './SpacedPageContent'

export default function DeploySection() {
  const Fade = useFadePage()
  return (
    <Fade.FadeProvide>
      <Page.BackgroundParallax
        speed={0.5}
        offset={0}
        top="-20%"
        bottom="-20%"
        scale={1.5}
        opacity={0.34}
        background="radial-gradient(circle closest-side, #9930C9, transparent)"
        parallax={geometry => ({
          y: geometry.useParallax(),
          x: geometry.useParallax().transform(x => x * 1 - 240),
        })}
      />

      <Page.BackgroundParallax
        speed={-0.57}
        offset={0.4}
        scale={1.5}
        opacity={0.24}
        background="radial-gradient(circle closest-side, #550033, transparent)"
      />

      <SpacedPageContent
        padding={['10vh', 0, '10vh']}
        nodeRef={Fade.ref}
        header={
          <>
            <FadeInView parallax delayIndex={0}>
              <PillButton>Develop</PillButton>
            </FadeInView>
            <FadeInView parallax delayIndex={1}>
              <TitleText textAlign="center" size="xxl">
                Next-level{' '}
                <Tooltip label="Developer Experience">
                  <View display="inline" borderBottom={[1, 'dotted', [255, 255, 255, 0.5]]}>
                    DX
                  </View>
                </Tooltip>
              </TitleText>
            </FadeInView>
          </>
        }
      >
        <Space size={60} />
        <Stack direction="horizontal" space={60} sm-space={0} margin={[0, '-180%']} sm-margin="0">
          <Stack sm-display="none" flex={2} alignItems="flex-end" justifyContent="center">
            <FadeInView parallax {...fadeAnimations.left} delayIndex={2}>
              <Parallax.View
                borderRadius={10}
                elevation={3}
                width={400}
                height={350}
                backgroundImage={`url(${appScreenshot})`}
                backgroundSize="contain"
                backgroundPosition="center center"
                backgroundRepeat="no-repeat"
                position="relative"
                parallax={geometry => ({
                  x: geometry.useParallax().transform(x => (x > 0 ? -x : x) * 0.1),
                })}
              >
                <Image
                  position="absolute"
                  top={0}
                  right={-70}
                  zIndex={100}
                  src={arrow}
                  transform={{ scale: 0.6 }}
                />
              </Parallax.View>
            </FadeInView>
          </Stack>

          <Stack
            space="xxl"
            flex={3}
            sm-width="100%"
            minWidth={300}
            maxWidth={380}
            sm-maxWidth="100%"
          >
            <FadeInView parallax delayIndex={1}>
              <ParagraphIntro
                // {...fontProps.TitleFont}
                size="lg"
                alpha={0.8}
                fontWeight={400}
              >
                A meticulously built developer environment designed for productivity.
              </ParagraphIntro>
            </FadeInView>

            <FadeInView parallax delayIndex={2}>
              <Stack space="sm">
                <Item>No config, no code to start an app.</Item>
                <Item>100ms hot reloads with error recovery.</Item>
                <Item>A suite of tools for understanding state/data.</Item>
                <Item>Rich debugging tools built-in.</Item>
              </Stack>
            </FadeInView>

            <FadeInView parallax delayIndex={3}>
              <Link fontWeight={600} size="lg" href="/start">
                Get started ››
              </Link>
            </FadeInView>
          </Stack>

          <Stack sm-display="none" flex={2} alignItems="flex-start" justifyContent="center">
            <FadeInView parallax {...fadeAnimations.right} delayIndex={3}>
              <Parallax.View
                borderRadius={10}
                elevation={3}
                width={400}
                height={350}
                backgroundImage={`url(${codeScreenshot})`}
                backgroundSize="contain"
                backgroundPosition="center center"
                backgroundRepeat="no-repeat"
                overflow="hidden"
                parallax={geometry => ({
                  x: geometry.useParallax().transform(x => -(x > 0 ? -x : x) * 0.1),
                })}
              />
            </FadeInView>
          </Stack>
        </Stack>
        <View flex={10} />
      </SpacedPageContent>
    </Fade.FadeProvide>
  )
}
