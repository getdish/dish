import { Grid, ListItem, SimpleText, Stack, TextProps, Theme, View } from '@o/ui'
import React, { memo } from 'react'

// import earth from '../../public/images/earth.jpg'
import { FadeInView, FadeParent } from '../../views/FadeInView'
import { MediaSmallHidden } from '../../views/MediaView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

export const SubParagraph = (props: TextProps) => (
  <Paragraph
    textAlign="left"
    size={1.35}
    sizeLineHeight={1.25}
    fontWeight={300}
    alpha={0.6}
    {...props}
  />
)

export default function MissionMottoSection() {
  return (
    <Theme name="home">
      <AboutSection />

      <Page.BackgroundParallax
        speed={0.2}
        zIndex={-2}
        className="earth"
        // backgroundImage={`url(${earth})`}
        backgroundSize="contain"
        backgroundPosition="center center"
        backgroundRepeat="no-repeat"
        x="6%"
        offset={-0.05}
      />
    </Theme>
  )
}

const Item = (props) => (
  <ListItem title={<SimpleText flex={1} size="sm" alpha={0.75} {...props} />} icon="tick" />
)

export const AboutSection = memo(() => {
  return (
    <FadeParent>
      <SpacedPageContent
        padding={['12vh', '10%']}
        sm-padding={0}
        header={
          <>
            <FadeInView>
              <PillButton>About</PillButton>
            </FadeInView>
            <FadeInView delayIndex={1}>
              <TitleText textAlign="center">A better deal for developers.</TitleText>
            </FadeInView>
          </>
        }
      >
        <View flex={1} />
        <Grid space="10%" itemMinWidth={340} height="70%">
          <Stack space="lg">
            <FadeInView delayIndex={2}>
              <TitleTextSub textAlign="left" alpha={1}>
                It's way too hard to build a decent application that gives you control, and lets you
                deploy where you want.
              </TitleTextSub>
            </FadeInView>

            <FadeInView delayIndex={3}>
              <SubParagraph>
                Let's give developers more control and users a better experience out of the box.
              </SubParagraph>
            </FadeInView>

            <FadeInView delayIndex={4}>
              <SubParagraph>
                It starts with apps that are easier to build and are built to last: open source, and
                cross-platform by default.
              </SubParagraph>
            </FadeInView>

            <FadeInView delayIndex={5}>
              <SubParagraph>We're excited to share it with you.</SubParagraph>
            </FadeInView>
          </Stack>

          <MediaSmallHidden>
            <Stack space="md" justifyContent="flex-end">
              <FadeInView delayIndex={5}>
                <TitleTextSub textAlign="left" alpha={1} size={1}>
                  Our goals
                </TitleTextSub>
              </FadeInView>

              <FadeInView delayIndex={6}>
                <Item>Build apps without infrastructure.</Item>

                <Item>Deliver a truly native-feeling, multi-platform app experience.</Item>

                <Item>Make DX a first-class citizen.</Item>

                <Item>Give users control over their data.</Item>
              </FadeInView>
            </Stack>
          </MediaSmallHidden>
        </Grid>
      </SpacedPageContent>
    </FadeParent>
  )
})
