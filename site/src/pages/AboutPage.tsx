import {
  BorderRight,
  Divider,
  Image,
  Inline,
  ListItemSimple,
  PassProps,
  Space,
  Stack,
  TextProps,
  Theme,
  Title,
  View,
  scrollTo,
} from '@o/ui'
import { mount, route } from 'navi'
import React from 'react'

import { fontProps } from '../constants'
import { Header } from '../Header'
// import confettiImage from '../public/images/confetti.jpg'
import { linkProps } from '../useLink'
import { FadeInView, useFadePage } from '../views/FadeInView'
import { Page } from '../views/Page'
import { SectionContent } from '../views/SectionContent'
import MissionMottoSection from './HomePage/MissionMottoSection'

export default mount({
  '/': route({
    title: 'About',
    view: <AboutPage />,
  }),
})

const BigParagraph = (props: TextProps) => (
  <Title
    selectable
    size="xs"
    alpha={0.6}
    fontWeight={100}
    sizeLineHeight={1.35}
    {...props}
  />
)

const BigTitle = (props: TextProps) => (
  <Title selectable size={1.5} fontWeight={100} {...props} />
)

export function AboutPage() {
  const Fade = useFadePage({
    threshold: 0,
  })

  return (
    <Fade.FadeProvide>
      <Theme name={AboutPage.theme}>
        <Header noBorder background="transparent" slim />
        <Page pages="auto">
          <main
            className="main-contents"
            ref={Fade.ref}
            style={{ minHeight: 2000 }}
          >
            <SectionContent paddingTop={60}>
              {/* <Image
                margin="auto"
                height={714 * 0.4}
                width={894 * 0.4}
                src={confettiImage}
              /> */}
            </SectionContent>

            <SectionContent flex={1} paddingTop="5%" paddingBottom="5%">
              <Stack direction="horizontal" id="main" alignItems="flex-start">
                <Stack
                  id="sidebar"
                  width={200}
                  pointerEvents="auto"
                  sm-width={0}
                  sm-opacity={0}
                >
                  <Stack
                    position="relative"
                    className="sidebar__inner"
                    flex={1}
                  >
                    <FadeInView delay={200}>
                      <Space size={35} />
                      <PassProps
                        titleProps={{
                          fontSize: 18,
                          padding: [10, 20],
                          textAlign: 'right',
                        }}
                        {...fontProps.TitleFont}
                      >
                        <ListItemSimple
                          onClick={() => {
                            scrollTo('#mission')
                          }}
                          title="Mission"
                        />
                        <ListItemSimple
                          onClick={() => {
                            scrollTo('#team')
                          }}
                          title="Team"
                        />
                        <ListItemSimple
                          onClick={() => {
                            scrollTo('#jobs')
                          }}
                          title="Jobs"
                        />
                        <ListItemSimple
                          onClick={() => {
                            scrollTo('#contact')
                          }}
                          title="Contact"
                        />
                      </PassProps>
                      <BorderRight top={10} opacity={0.5} />
                    </FadeInView>
                  </Stack>
                </Stack>
                <FadeInView delay={400} style={{ flex: 1 }}>
                  <Stack
                    padding={[0, '10%']}
                    space={80}
                    spaceAround
                    flex={1}
                    overflow="hidden"
                    className="content"
                  >
                    <Stack space="xxxl" id="mission">
                      <BigTitle>
                        Make it easy to put together powerful tools for your
                        team.
                      </BigTitle>

                      <BigParagraph>
                        There's a better future ahead where building apps and
                        managing data is unified into a collaborative IDE and
                        workspace. One where it's easy to explore, easy to
                        build, and totally under our control.
                      </BigParagraph>

                      <BigParagraph>
                        Orbis is a new type of thing: an app platform focused on
                        work apps.
                      </BigParagraph>
                    </Stack>

                    <Divider />

                    <Stack space="xxxl" id="team">
                      <BigTitle>
                        Passionate about the future of software and creation.
                      </BigTitle>

                      <BigParagraph>
                        Our team is all over the world. We're always looking for
                        great developers who are passionate about rethinking and
                        improving our interfaces, making development far easier
                        and more intuitive, and who are driven by creating
                        things of high quality.
                      </BigParagraph>

                      <BigParagraph>
                        <Inline {...linkProps('mailto:hi@tryorbit.com')}>
                          Get in touch
                        </Inline>
                        .
                      </BigParagraph>
                    </Stack>

                    <Space size="xxxl" />
                    <Divider />
                    <Space size="xxxl" />

                    <Stack space="xxxl" id="contact">
                      <BigTitle>Get in touch</BigTitle>

                      <BigParagraph>
                        <Inline {...linkProps('mailto:hi@tryorbit.com')}>
                          Email
                        </Inline>
                      </BigParagraph>

                      <BigParagraph>
                        <Inline {...linkProps('https://twitter.com/tryorbit')}>
                          Twitter
                        </Inline>
                      </BigParagraph>

                      <BigParagraph>
                        <Inline {...linkProps('https://github.com/natew')}>
                          Github
                        </Inline>
                      </BigParagraph>
                    </Stack>
                  </Stack>
                </FadeInView>
              </Stack>
            </SectionContent>

            <View flex={1} />

            <MissionMottoSection />

            <BlogFooter />
          </main>
        </Page>
      </Theme>
    </Fade.FadeProvide>
  )
}

AboutPage.theme = 'home'
