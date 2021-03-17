import { BorderTop, Button, FullScreen, Image, memoIsEqualDeep, Space, Stack, useTheme, View } from '@o/ui'
import React, { memo } from 'react'

import orbits from '../../public/images/orbits.svg'
import { linkProps } from '../../useLink'
import { fadeAnimations, FadeInView, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { apps } from './apps'
import { BodyButton } from './BodyButton'
import { SpacedPageContent } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

export default memo(() => {
  const FadeDataApps = useFadePage({ threshold: 0 })
  return (
    <FadeDataApps.FadeProvide>
      {/* deep purple right */}
      <Page.BackgroundParallax
        offset={-0.3}
        speed={0.45}
        zIndex={-2}
        opacity={0.45}
        x="10%"
        scale={2.5}
        background="radial-gradient(circle closest-side, #7523AD, transparent)"
      />

      <Page.BackgroundParallax
        speed={0.075}
        offset={0.5}
        top={50}
        opacity={0.5}
        zIndex={-2}
        scale={0.45}
        transformOrigin="bottom center"
        // keeps it from cropping on small screen
        left="-40%"
        right="-40%"
        width="auto"
      >
        <FadeInView parallax delay={800} height="90%" width="100%">
          <FullScreen
            left={-120}
            right={-120}
            maxHeight={450}
            className="orbitals"
            backgroundImage={`url(${orbits})`}
            backgroundPosition="top center"
            backgroundRepeat="no-repeat"
          />
        </FadeInView>
      </Page.BackgroundParallax>

      <SpacedPageContent
        nodeRef={FadeDataApps.ref}
        height="auto"
        maxHeight={100000}
        margin={0}
        // extra on top for the orbits
        padding={['28vh', 0, '8vh']}
        xs-margin={0}
        header={
          <>
            <FadeInView parallax delayIndex={0}>
              <PillButton>App Store</PillButton>
            </FadeInView>
            <FadeInView parallax delayIndex={1}>
              <TitleText textAlign="center" size="xl">
                Apps that play along
              </TitleText>
            </FadeInView>
            <FadeInView parallax delayIndex={2}>
              <TitleTextSub>
                Sync data, expose GraphQL and TypeScript APIs, and render&nbsp;content.
                The&nbsp;app&nbsp;store&nbsp;enables cooperative app-building.
              </TitleTextSub>
            </FadeInView>
            <Space size="xl" />
          </>
        }
      >
        <Stack
          direction="horizontal"
          className="hide-scrollbars"
          height="auto"
          space="md"
          padding={['xxl', false]}
          spaceAround
          justifyContent="center"
          pointerEvents="none"
          transform={{
            y: -120,
          }}
        >
          {apps.map((app, index) => {
            let pivot = Math.round(apps.length / 2) - 1
            let offset = index * 30
            if (index >= pivot) {
              let i = index - pivot
              offset = pivot * 30 - i * 30
            }
            return (
              <Integration
                key={app.title}
                index={index}
                {...app}
                transform={{ y: `${offset}px` }}
              />
            )
          })}
        </Stack>

        <Space size="lg" />

        <FadeInView parallax delayIndex={3} {...fadeAnimations.up}>
          <Stack direction="horizontal" space margin={[0, 'auto']}>
            <BodyButton {...linkProps('/apps')} size="lg">
              Explore apps
            </BodyButton>
          </Stack>
        </FadeInView>
      </SpacedPageContent>
    </FadeDataApps.FadeProvide>
  )
})

const Integration = memoIsEqualDeep(({ icon, title, index, downloads, hearts, ...props }: any) => {
  const theme = useTheme()
  const borderColor = theme.borderColor.setAlpha(0.1)
  return (
    <FadeInView
      parallax
      {...(index % 1 == 0 ? fadeAnimations.up : fadeAnimations.down)}
      delay={index * 100 + 250}
    >
      <View
        animate={{
          y: -10,
        }}
        transition={{ yoyo: Infinity, duration: 2, repeatDelay: index * 1 }}
      >
        <View
          userSelect="none"
          height={140}
          width={130}
          borderRadius={10}
          border={[1, borderColor]}
          {...props}
        >
          <Stack padding space alignItems="center" justifyContent="center">
            <Image
              src={icon}
              transition="all ease 200ms"
              maxWidth={56}
              width="50%"
              height="auto"
              hoverStyle={{ opacity: 1 }}
            />
            <Paragraph selectable={false} size="sm">
              {title}
            </Paragraph>
          </Stack>
          <Stack
            direction="horizontal"
            opacity={0.5}
            position="relative"
            alignItems="center"
            justifyContent="space-between"
          >
            <BorderTop borderColor={borderColor} />
            <Button chromeless size={0.9} icon="download">
              {downloads}
            </Button>
            <Button chromeless size={0.9} icon="heart" iconAfter>
              {hearts}
            </Button>
          </Stack>
        </View>
      </View>
    </FadeInView>
  )
})
