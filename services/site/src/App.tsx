import './assets/font-gteesti/stylesheet.css'
import './site.css'

import React, { useReducer, useRef } from 'react'
import { Pressable } from 'react-native'
import {
  Circle,
  HStack,
  Paragraph,
  ParagraphProps,
  Spacer,
  StackProps,
  Text,
  TextProps,
  Theme,
  Title,
  TitleProps,
  VStack,
  defaultMediaQueries,
  useMedia,
} from 'snackui'
import { Button } from 'snackui'
import { AbsoluteVStack } from 'snackui'

import { LogoVertical } from './LogoVertical'

const DishParagraph = (props: ParagraphProps) => {
  return <Paragraph className="title-font" sizeLineHeight={1.4} {...props} />
}

const DishTitle = (props: TitleProps) => {
  return <Title className="title-font" selectable {...props} />
}

const DishTitleSlanted = (props: TitleProps) => {
  return (
    <Title
      className="title-font"
      selectable
      backgroundColor="#444"
      paddingHorizontal={15}
      paddingVertical={6}
      borderRadius={10}
      zIndex={10}
      transform={[
        {
          rotate: '-4deg',
        },
      ]}
      {...props}
    />
  )
}

const DishTitleFitted = (props: TitleProps) => {
  const media = useMedia()
  return (
    <DishTitle
      alignSelf="center"
      textAlign="center"
      // @ts-expect-error
      fontSize="5.5vw"
      {...(media.sm && {
        fontSize: 44,
      })}
      {...(media.xl && {
        fontSize: 70,
      })}
      {...props}
    />
  )
}

export const App = () => {
  return (
    <>
      <Container position="relative" zIndex={1} paddingVertical={40} marginHorizontal="auto">
        <LogoVertical />

        <VStack height={150} alignItems="center" justifyContent="center">
          <DishTitleFitted>real world pokédex</DishTitleFitted>
        </VStack>

        <DishParagraph
          color="rgba(255,255,255,0.65)"
          size="xxl"
          sizeLineHeight={0.9}
          letterSpacing={1.2}
          textAlign="center"
        >
          a guide to the world,
          <br />
          powered by a community,
          <br />
          incenvitized by a coin.
        </DishParagraph>

        <Spacer size="xxxl" />

        <VStack className="float-up-down">
          <VStack
            alignSelf="center"
            shadowColor="#000"
            shadowRadius={60}
            shadowOpacity={0.5}
            shadowOffset={{
              width: -60,
              height: 100,
            }}
            transform={[
              {
                perspective: 100000,
              },
              {
                rotateX: '52deg',
              },
              {
                rotateY: '10deg',
              },
              {
                rotateZ: '-30deg',
              },
            ]}
          >
            <VStack
              borderRadius={30}
              shadowColor="blue"
              shadowRadius={130}
              shadowOpacity={0.5}
              shadowOffset={{
                width: -20,
                height: 20,
              }}
              marginTop={-60}
              marginBottom={-60}
            >
              <img
                width={563 / 2}
                height={1144 / 2}
                style={{
                  borderRadius: 20,
                }}
                src={require('./assets/iphone-home-screen.jpg').default}
              />
            </VStack>
          </VStack>
        </VStack>
      </Container>

      <Theme name="dark">
        <VStack
          position="relative"
          zIndex={0}
          marginTop={-500}
          paddingTop={500}
          className="before-bg purple-bg fade-lighter-bg"
          backgroundColor="#6400ab"
        >
          <Circle
            position="absolute"
            className="head-circle"
            top={-1140}
            size={1460}
            backgroundColor="#000"
            alignSelf="center"
          />

          <Container marginHorizontal="auto">
            <ContentSection paddingTop={0}>
              <DishParagraph textAlign="center" fontWeight="800" size={5} sizeLineHeight={0.7}>
                Review platforms keep failing us.
              </DishParagraph>

              <DishParagraph size="xxxl">
                Hidden. Faked. Averaged. Unopinionated. All because of a fear of advertisers, growth
                pressure from VC, and a lack of focus on product / community / incentives.
              </DishParagraph>

              <DishParagraph size="xxl">
                Sure, any startup could come and fix it. But ultimately they raise 💸, need to show
                hockey stick graphs 🏒 and the cycle starts again.
              </DishParagraph>

              <DishParagraph size="xxl">
                Dish aims to solve this. A small team of top talent at a{' '}
                <b>non-profit organization</b> designed to stay small. An{' '}
                <b>incentivizing, community-owned coin</b> tied to a referral-based{' '}
                <b>single-identity user system</b>. And <b>voting and governance</b> built in.
              </DishParagraph>

              <DishParagraph size="xxl">
                It's web 3.0, with a real product. We think this model achieves:
              </DishParagraph>

              <ul style={{ marginLeft: 40 }}>
                <DishParagraph size="xl">
                  <li>Deliberate, slow growth without the downsides of VC pressure.</li>
                </DishParagraph>
                <Spacer />
                <DishParagraph size="xl">
                  <li>Early adopter buy-in, ownership and leadership.</li>
                </DishParagraph>
                <Spacer />
                <DishParagraph size="xl">
                  <li>Ability to reward users for contibuting, leading to better content.</li>
                </DishParagraph>
                <Spacer />
                <DishParagraph size="xl">
                  <li>Better alignment of incentives all around.</li>
                </DishParagraph>
              </ul>

              <HStack className="nav-buttons" spacing="xl" justifyContent="center">
                <VStack className="story-time-button">
                  <label htmlFor="toggle-story-time">
                    <Pressable>
                      <Button
                        paddingVertical={15}
                        paddingHorizontal={27}
                        backgroundColor="rgba(0,0,0,0.2)"
                        textProps={{
                          fontWeight: '300',
                          lineHeight: 24,
                          fontSize: 20,
                        }}
                      >
                        Why a coin?
                      </Button>
                    </Pressable>
                  </label>
                </VStack>
                <Pressable>
                  <Button
                    paddingVertical={15}
                    paddingHorizontal={27}
                    backgroundColor="rgba(0,0,0,0.2)"
                    textProps={{
                      fontWeight: '300',
                      lineHeight: 24,
                      fontSize: 20,
                    }}
                  >
                    What is dish?
                  </Button>
                </Pressable>
              </HStack>
            </ContentSection>
          </Container>
        </VStack>

        <VStack backgroundColor="var(--blue)">
          <VStack zIndex={1} position="relative">
            <Slants />
          </VStack>

          <input id="toggle-story-time" type="checkbox" className="story-time-check" />

          <VStack position="relative" zIndex={2} className="story-time" position="relative">
            <AbsoluteVStack top={0} left={-300} right={-300}>
              <VStack transform={[{ rotate: '-10deg' }]}>
                {[...new Array(10)].map((_, i) => {
                  return (
                    <VStack
                      opacity={0.08}
                      key={i}
                      marginBottom={-120}
                      transform={[{ scaleX: 2.5 }]}
                    >
                      <Wave
                        key={i}
                        direction="vertical"
                        stopColor="var(--blue)"
                        {...(i % 2 === 0
                          ? {
                              startColor: '#ed137b',
                            }
                          : {
                              startColor: '#249bea',
                              stopColor: 'var(--blue)',
                            })}
                      />
                    </VStack>
                  )
                })}
              </VStack>
            </AbsoluteVStack>

            <ContentSection marginHorizontal="auto">
              <label htmlFor="toggle-story-time">
                <VStack
                  marginTop={-40}
                  marginBottom={20}
                  alignItems="center"
                  zIndex={100}
                  position="relative"
                >
                  <DishTitleSlanted
                    size="xl"
                    fontWeight="800"
                    backgroundColor="var(--blue)"
                    color="#fff"
                  >
                    Why a coin?
                  </DishTitleSlanted>
                </VStack>
              </label>

              <DishParagraph size="xxxxl">
                It's 2038: your VR CryptoKitty, Jerry, nestles ethereally on your lap. He looks up
                at you, again. You wave floating excel sheets away and smile.
              </DishParagraph>

              <DishParagraph size="xxl">
                “Should we reschedule the dentists tomorrow?” he asks, “you have that matinee with
                your mom, and traffics looking to be not-so-a-good-a."
              </DishParagraph>

              <DishParagraph size="xxl">
                “Jerry,” you sigh, “is the minute I finish work really the time to be reminding me
                of dentists, traffic and <b>matinees</b>?"
              </DishParagraph>

              <DishParagraph size="xxl">
                Still, the words reverberate in your mind... dentist, traffic, matinee. Why is that
                ringing a bell? “Mat-in-<b>ayy</b>...” you repeat out loud, “<b>mat</b>
                -in-ay"...
              </DishParagraph>

              <DishParagraph size="xxl">
                Wait a second... “<b>Matt</b>!” you jump up, passing clean through Jerry, who leaps
                away. “Matt's birthday dinner is... tomorrow!"
              </DishParagraph>

              <DishParagraph size="xxl">
                Holy cow. How did Jerry miss that? And now there's no way you can make the party...
                you have that <b>matinee</b>. Still... you've got to do <em>something</em>.
              </DishParagraph>

              <DishParagraph size="xxl">Luckily, Jerry has an idea:</DishParagraph>

              <DishParagraph size="xxxl">
                “Why not get him this{' '}
                <b>1-of-100 CryptoKitty Kaws x Apple Paisley Handkerchief NFT</b> - it's only $150.”
              </DishParagraph>

              <DishParagraph size="xxl">
                Brilliant. Without a moments hestitation you buy it, wrap it with a voice note,
                reschedule the dentists and <b>boom</b>. Problems solved.
              </DishParagraph>

              <DishParagraph size="xxxl">
                <b>An NFT success story, right?</b>
              </DishParagraph>
            </ContentSection>

            <VStack marginVertical={-20} alignItems="center">
              <DishTitleSlanted
                size="xxl"
                fontWeight="800"
                backgroundColor="var(--pink)"
                color="#fff"
              >
                Sort of!
              </DishTitleSlanted>
            </VStack>

            <VStack className="pink-section-not">
              <Theme name="dark">
                <VStack marginTop={-20}>
                  <ContentSection marginHorizontal="auto">
                    <DishParagraph size="xxxxl">
                      First of all, listen. I think the above story is an <em>okay</em> use of
                      crypto. I'm not here to pillory digital kitties or virtual goods as dystopian.
                    </DishParagraph>

                    <DishParagraph size="xl">
                      (At least handkerchief is not just freely available for anyone else to use
                      exactly like you.)
                    </DishParagraph>

                    <DishParagraph size="xxxl">
                      The whole Jerry story is just to say that{' '}
                      <b>
                        the quality of Jerry is what lends value to the handkerchief, not some
                        inherent scarcity
                      </b>
                      .
                    </DishParagraph>

                    <DishParagraph size="xxxl">
                      In other words,{' '}
                      <b>
                        the valuable, lasting web 3.0 startups will look and be valued like any
                        other startup - their value is based how they execute outside any "crypto"
                        stuff
                      </b>
                      . That is, at least once the dust settles a bit and outside of direct
                      financial type applications.
                    </DishParagraph>

                    <DishParagraph size="xxxl">
                      They'll just have more interesting ownership, incentivization, governance, and
                      community mechanisms.
                    </DishParagraph>

                    <DishParagraph size="xl">Ok, that said...</DishParagraph>
                  </ContentSection>
                </VStack>
              </Theme>
            </VStack>
          </VStack>
        </VStack>

        <VStack zIndex={1000} className="shadow-above" marginTop={-120} position="relative">
          <VStack marginTop={-40} height={250} zIndex={10} transform={[{ scaleX: 2 }]}>
            <Wave direction="vertical" />
          </VStack>

          <VStack marginTop={-70} marginBottom={-20} alignItems="center">
            <DishTitleSlanted
              size="lg"
              fontWeight="800"
              backgroundColor="var(--yellow)"
              color="#000"
            >
              What is dish?
            </DishTitleSlanted>
          </VStack>

          <Theme name="light">
            <VStack className="yellow-section" marginTop={-40}>
              <ContentSection marginHorizontal="auto">
                <DishParagraph sizeLineHeight={0.8} size={4}>
                  <b>
                    <Highlight backgroundColor="red" color="#fff">
                      Dish is a pocket guide to the world
                    </Highlight>
                  </b>
                </DishParagraph>

                <DishParagraph size="xxxl">
                  <b>Honestly, it's a lot like Yelp or Google Maps, or TripAdvisor.</b> Or
                  FourSquare. Remember FourSquare?
                </DishParagraph>

                <DishParagraph size="xxl">
                  And the cool thing is <b>it actually already exists</b> and the team behind it is
                  a team of experience product people who've done this before.
                </DishParagraph>

                <DishParagraph size="xxxxl">It's not rocket science 🚀, for sure.</DishParagraph>

                <DishParagraph size="xxl">
                  But we are doing a few things differently - we think the ratings systems in
                  general are failing us, and we've done some really cool things to improve them.
                </DishParagraph>

                <DishParagraph size="xxl">
                  But importantly, we think a lot of what makes a ratings site good is incentives,
                  community, and good moderation. From another point of view,{' '}
                  <b>
                    what's the point of writing reviews free reviews for Google, when they keep all
                    the money for themselves?
                  </b>
                </DishParagraph>

                <DishParagraph size="xxl">
                  So much like YouTube and TikTok pay their content creators, we're going to pay
                  DishCoin for all sorts of actions that improve the <b>quality</b> of Dish. From
                  writing reviews, to moderating sub-communities, to uploading good quality images,
                  and more.
                </DishParagraph>

                <DishParagraph size="xxl">
                  Before the whole coin thing ever even became a twinkle of an idea, Dish was years
                  in the making. We've spent grueling months designing something that's beautiful,
                  and works well - <b>even without a drop of crypto</b>.
                </DishParagraph>

                <DishParagraph size="xxl">But then we kept asking ourselves:</DishParagraph>

                <DishParagraph size="xxxxl">
                  How will we grow it without VC money that will pressure use to sell out?
                </DishParagraph>

                <DishParagraph size="xxl">
                  And that's finally when the whole coin idea came up.
                </DishParagraph>

                <DishParagraph size="xxxxl">With all that said,</DishParagraph>
              </ContentSection>
            </VStack>
          </Theme>
        </VStack>

        <VStack className="before-bg purple-bg-alt">
          <VStack zIndex={1000} position="relative" marginVertical={-20} alignItems="center">
            <DishTitleSlanted size="lg" fontWeight="800" backgroundColor="yellow" color="#000">
              How a coin saves us from selling out:
            </DishTitleSlanted>
          </VStack>

          <Theme name="light">
            <ContentSection marginHorizontal="auto">
              <DishParagraph size="xxxxl">
                I do think the <b>how</b> of making the best guide in the world is really
                interesting.
              </DishParagraph>

              <DishParagraph size="xxxl">
                And that's where we get back to Jerry, and crypto.
              </DishParagraph>

              <DishParagraph size="xxxl">
                You see, <b>Dish has a coin.</b>
              </DishParagraph>

              <DishParagraph size="xxl">Ok? There, I said it.</DishParagraph>

              <DishParagraph size="xxl">
                That's the downside of everyone buying into all these fly-by-night crypto scams.{' '}
                <em>They're using the tool terribly,</em> and that means I have to write a boring
                and long blog post about virtual cats when all I want to do is build a more
                equitable Yelp.
              </DishParagraph>

              <DishParagraph marginLeft={20} size="xl">
                <li>
                  A personalized map of the gems 💎 to eat out at or order for delivery, unique to
                  you, down to the neighborhood.
                </li>
              </DishParagraph>

              <DishParagraph marginLeft={20} size="xl">
                <li>
                  Definitive rankings of the best dishes. We crawl the whole damn web and use "AI"
                  (off-the-shelf neural networks) to get sentiment towards each and every dish at
                  each and every restaurant. Think RottenTomatoes but for 🌮 and with a great
                  community.
                </li>
              </DishParagraph>

              <DishParagraph marginLeft={20} size="xl">
                <li>
                  And <b>playlists</b>. This ones fun. Share your favorite days out, cafe's to work
                  at, or a really nice date night as a playlist. Vote, explore, and try out others
                  lists.
                </li>
              </DishParagraph>
            </ContentSection>
          </Theme>
        </VStack>
      </Theme>
    </>
  )
}

const Highlight = (props: TextProps) => {
  return <Text padding={4} margin={-4} borderRadius={4} {...props} />
}

const ContentSection = (props: StackProps) => {
  return (
    <VStack
      position="relative"
      maxWidth={800}
      alignSelf="center"
      spacing="xxl"
      paddingHorizontal={20}
      paddingVertical={100}
      {...props}
    />
  )
}

// TODO need to fix up
const Container = (props: StackProps) => {
  const media = useMedia()

  return (
    <VStack
      width="100%"
      maxWidth={1124}
      {...(media.sm && {
        maxWidth: defaultMediaQueries.sm.maxWidth,
      })}
      {...(media.md && {
        maxWidth: defaultMediaQueries.md.minWidth,
      })}
      {...props}
    />
  )
}

const Slants = () => {
  return (
    <>
      <VStack
        className="slant-bg transform-origin-tl"
        width="100vw"
        height={500}
        position="absolute"
        top={0}
        left="50%"
        transform={[
          {
            rotate: '-3deg',
          },
          {
            translateX: -30,
          },
        ]}
      />
      <VStack
        className="slant-bg transform-origin-tr"
        width="100vw"
        height={500}
        position="absolute"
        top={0}
        right="50%"
        transform={[
          {
            rotate: '3deg',
          },
          {
            translateX: 30,
          },
        ]}
      />
    </>
  )
}

const Wave = ({
  direction,
  startColor = '#FFC338',
  stopColor = '#FFEA68',
}: {
  direction?: 'vertical'
  startColor?: string
  stopColor?: string
}) => {
  const id = useRef(`svg-${Math.round(Math.random() * 100000)}`)
  const gradientId = `${id.current}`
  return (
    <svg viewBox="7.5 0 60 10">
      <defs>
        <linearGradient
          id={gradientId}
          {...(direction === 'vertical' && {
            x1: '0',
            x2: '0',
            y1: '0',
            y2: '1',
          })}
        >
          <stop offset="5%" stopColor={startColor} />
          <stop offset="95%" stopColor={stopColor} />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        d="M0 10 V5 Q2.5 2.5 5 5 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 V10"
      />
    </svg>
  )
}
