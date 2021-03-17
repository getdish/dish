import { Image, Space, Stack } from '@o/ui'
import React from 'react'

import people from '../../assets/illustrations/undraw_server_down_s4lk.svg'
import { mediaStyles } from '../../constants'
import { fadeAnimations, FadeInView, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

export default function SecuritySection() {
  const Fade = useFadePage()
  return (
    <Fade.FadeProvide>
      <Page.BackgroundParallax
        speed={0.3}
        zIndex={-2}
        opacity={0.235}
        top="20%"
        x="-55%"
        scale={1.6}
        background="radial-gradient(circle closest-side, #681635, transparent)"
        parallax={geometry => ({
          y: geometry.useParallax().transform(x => x + 300),
          x: geometry.useParallax().transform(x => -x),
        })}
      />

      <SpacedPageContent
        nodeRef={Fade.ref}
        padding={['10vh', '5%', '10vh']}
        margin="auto"
        header={
          <>
            <FadeInView parallax delayIndex={0}>
              <PillButton>Trust</PillButton>
            </FadeInView>
            <FadeInView parallax delayIndex={1}>
              <TitleText textAlign="center" size="xl">
                Open & secure
              </TitleText>
            </FadeInView>
            <FadeInView parallax delayIndex={2} {...fadeAnimations.up}>
              <TitleTextSub>Completely on-device, open source &&nbsp;customizable.</TitleTextSub>
            </FadeInView>
          </>
        }
      >
        <Space size="xxxl" />
        <FadeInView parallax delayIndex={3} {...fadeAnimations.up}>
          <Stack direction="horizontal" flex={1} space="xxxl">
            <Stack flex={3} space="xl">
              <Pitch alpha={1} size="lg">
                You're in control.
              </Pitch>

              <Pitch alpha={0.75} size="md">
                Orbit runs privately on your device, never sending a single bit of data outside your
                firewall. It's completely open source. No cloud, no servers, no telemetry, no worry.
              </Pitch>
            </Stack>

            <Stack flex={4} padding={0} {...mediaStyles.visibleWhen.abovesm}>
              <Image userSelect="none" width="100%" maxWidth={300} margin="auto" src={people} />
            </Stack>
          </Stack>
        </FadeInView>
      </SpacedPageContent>
    </Fade.FadeProvide>
  )
}

const Pitch = props => <TitleTextSub textAlign="left" sizeFont={1.2} {...props} />
