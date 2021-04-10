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
      <Container position="relative" zIndex={1} paddingTop={40} marginHorizontal="auto">
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
          what's <em>actually</em> good in every neighborhood
          <br />
          <Text fontSize="80%">a community, a coin, a non-profit, a guide</Text>
        </DishParagraph>
      </Container>

      <Spacer size="xxxl" />

      <VStack zIndex={100000} position="relative" className="float-up-down">
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
          zIndex={10000}
          backgroundColor="#000"
          alignSelf="center"
        />

        <VStack position="relative">
          <input id="toggle-platforms" type="checkbox" className="toggle-check" />

          <label className="toggle-cover" htmlFor="toggle-platforms">
            <AbsoluteVStack
              className="before-bg purple-bg purple-bg-hover hover-cursor-pointer tr-all tr-ease-in-out"
              // pointerEvents="none"
              // top={-1000}
              top={-500}
              left={0}
              right={0}
              bottom={1500}
              zIndex={100}
              pressStyle={{
                opacity: 0.4,
              }}
            />
          </label>

          <Container className="toggle-section" marginHorizontal="auto">
            <ContentSection paddingTop={0}>
              <VStack marginBottom={-10}>
                <label htmlFor="toggle-platforms">
                  <DishParagraph sizeLineHeight={0.8} fontWeight="800" size={4}>
                    <Highlight backgroundColor="var(--pink)" color="#fff">
                      Review platforms have problems.
                    </Highlight>
                  </DishParagraph>
                </label>
              </VStack>

              <DishParagraph size="xxxxl">
                Hidden. Faked. Averaged. Inflated.
                <br />
                <DishParagraph size="xxxl">
                  Pressure to grow fast means easy ad cash 💸,
                  <br />
                  but advertisers hate to be hated.
                </DishParagraph>
              </DishParagraph>

              <DishParagraph size="xxxl">
                There's a misalignment between a guide to purchasing, and profiting off advertising.
                Dish aims to solve these tensions with a <b>non-profit</b> and a{' '}
                <b>community-owned coin</b> with strictly equitable distribution, rewarding good
                curation.
              </DishParagraph>

              <DishParagraph size="xxl">We think it solves many alignment issues:</DishParagraph>

              <ul style={{ marginLeft: 40 }}>
                <DishParagraph size="xxl">
                  <li>Can grow slow without VC pressure and focus on quality.</li>
                </DishParagraph>
                <Spacer />
                <DishParagraph size="xxl">
                  <li>Early adopters have incentive for success.</li>
                </DishParagraph>
                <Spacer />
                <DishParagraph size="xxl">
                  <li>Ability to reward users for contibuting, leading to better content.</li>
                </DishParagraph>
                <Spacer />
                <DishParagraph size="xxl">
                  <li>Higher trust, ownership, involvement of community.</li>
                </DishParagraph>
              </ul>

              <HStack className="nav-buttons" spacing="xl" justifyContent="center">
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
                      a crypto story ⬇️
                    </Button>
                  </Pressable>
                </label>
              </HStack>
            </ContentSection>
          </Container>
        </VStack>
      </VStack>

      <VStack position="relative" zIndex={100} backgroundColor="var(--blue)">
        <Slants />

        <input id="toggle-story-time" type="checkbox" className="toggle-check" />

        <VStack zIndex={2} className="toggle-section" position="relative">
          <AbsoluteVStack pointerEvents="none" top={0} left={-300} right={-300} minWidth={2000}>
            {[...new Array(10)].map((_, i) => {
              return (
                <VStack
                  opacity={0.08}
                  key={i}
                  marginBottom={-220}
                  transform={[{ scaleX: 2.5 }, { rotate: `${i % 2 === 0 ? 10 : -10}deg` }]}
                >
                  <Wave
                    key={i}
                    direction="vertical"
                    stopColor="transparent"
                    {...(i % 2 === 0
                      ? {
                          startColor: '#ed137b',
                        }
                      : {
                          startColor: '#249bea',
                        })}
                  />
                </VStack>
              )
            })}
          </AbsoluteVStack>

          <ContentSection marginHorizontal="auto">
            <label htmlFor="toggle-story-time">
              <VStack
                marginTop={-60}
                marginBottom={20}
                alignItems="center"
                zIndex={100}
                position="relative"
              >
                <DishTitleSlanted
                  size="lg"
                  fontWeight="800"
                  backgroundColor="var(--teal)"
                  hoverStyle={{
                    backgroundColor: 'red',
                  }}
                  color="#fff"
                >
                  a crypto non-profit
                </DishTitleSlanted>
              </VStack>
            </label>
            <DishParagraph size="xxxxl">
              It's 2038, your Apple AR CryptoKitty, Jerry, nestles in your lap amongst ethereal
              excel sheets. You flick smile glowing kitty and he looks up at you.
            </DishParagraph>
            <DishParagraph size="xxl">
              “Should we reschedule the dentists?” Jerry begins, stretching, “you have that matinee,
              and traffic'll be tricky."
            </DishParagraph>
            <DishParagraph size="xxxl">
              You sigh, “is the minute I finish work really the time to be reminding me of dentists
              and traffic? And matinees?"
            </DishParagraph>
            <DishParagraph size="xxl">
              Of course, he was right. You <b>had</b> forgotten about the matinee, with mom.
              “Mat-in-
              <b>ayy</b> with mom...” you repeat, “<b>mat</b>-in-ay"...
            </DishParagraph>
            <DishParagraph size="xxl">
              Wait a second... “<b>Matt</b>!”
            </DishParagraph>
            <DishParagraph size="xxxl">
              You jump up, “Matt's birthday is tomorrow! There's no way I can make it!"
            </DishParagraph>
            <DishParagraph size="xxxl">
              “Why not just get him a 1-of-1000 <b>Kaws paisley Handkerchief NFT</b>,” Jerry offers
              right back, “only $10, and you guys just joked about paisley last week.”
            </DishParagraph>
            <DishParagraph size="xxl">
              They'll just have more interesting ownership, incentivization, governance, and
              community mechanisms.
            </DishParagraph>

            <Spacer size="xxxl" />
          </ContentSection>
        </VStack>
      </VStack>

      <VStack pointerEvents="none" zIndex={1000} marginTop={-180} position="relative">
        <VStack
          className="shadow-above"
          // marginVertical={-40}
          height={200}
          alignItems="flex-end"
          justifyContent="flex-end"
          minWidth={1200}
          zIndex={10}
          transform={[{ scaleX: 3.2 }, { translateX: -100 }]}
        >
          <Wave direction="vertical" />
        </VStack>

        <Theme name="light">
          <VStack className="yellow-section">
            <ContentSection marginTop={-150} marginHorizontal="auto" zIndex={1000}>
              <Spacer />

              <HStack spacing="md" justifyContent="center">
                <Text fontSize={20} paddingHorizontal={10} color="#000">
                  <b>what is dish?</b>
                </Text>
                <label htmlFor="toggle-story-time">
                  <Text fontSize={20} paddingHorizontal={10} color="var(--purple)">
                    <a>why review platforms fail</a>
                  </Text>
                </label>
                <label htmlFor="toggle-story-time">
                  <Text fontSize={20} paddingHorizontal={10} color="var(--purple)">
                    <a>a crypto story</a>
                  </Text>
                </label>
              </HStack>

              <DishParagraph textAlign="center" sizeLineHeight={0.8} size={4}>
                <b>
                  <Highlight backgroundColor="yellow" color="#000">
                    a pocket guide to the world
                  </Highlight>{' '}
                  <Text fontWeight="200">starting with food</Text>
                </b>
              </DishParagraph>

              <ul style={{ marginLeft: 40 }}>
                <VStack spacing="xl">
                  <DishParagraph size="xxxl">
                    <li>
                      <b>restaurants and delivery</b> - unique 💎 by neighborhood, taste based
                      recommendations.
                    </li>
                  </DishParagraph>
                  <DishParagraph size="xxxl">
                    <li>
                      <b>"TottenTomatoes"</b> reviews from around the web broken down, debated and
                      added to.
                    </li>
                  </DishParagraph>
                  <DishParagraph size="xxxl">
                    <li>
                      <b>playlists</b> make your list, vote, see top ones by tag, earn coins votes..
                    </li>
                  </DishParagraph>
                </VStack>
              </ul>

              <DishParagraph size="xxxl">
                <b>You get paid for YouTube and TikTok videos.</b>
              </DishParagraph>

              <DishParagraph size="xxxl">
                Google and Yelp make tremendous amounts of money off your content. Yet when writing
                reviews you get back... nada.
              </DishParagraph>

              <DishParagraph size="xxxl">
                Google's ad business does gangbusters, and a huge chunk of map searches are powered
                by the content and reviews you write.
              </DishParagraph>

              <DishParagraph size="xxl">
                So much like YouTube and TikTok pay their content creators, we're going to give
                DishCoin for all sorts of actions that improve the <b>quality</b> of Dish. A coin
                backed directly by company profits.
              </DishParagraph>

              <DishParagraph size="xl">
                Writing reviews, moderating, flagging, labeling, uploading good quality images,
                suggesting tags, and voting on lists and comments. There's so many ways a content
                site needs curators. It's a really good fit for a coin.
              </DishParagraph>

              <DishParagraph size="xl">
                All of this made sense, but it wasn't until we thought about the benefits of{' '}
                <b>not taking VC money</b> that things really clicked. You see, there's some
                fundamental tension between rating quality and pressure to make money. It's pretty
                obvious in retrospect, I mean:
              </DishParagraph>

              <ul style={{ marginLeft: 40 }}>
                <DishParagraph size="xl">
                  <li>Hiding negative reviews = increased ad money.</li>
                </DishParagraph>
                <Spacer />
                <DishParagraph size="xl">
                  <li>Inflating scores = increased ad money.</li>
                </DishParagraph>
                <Spacer />
                <DishParagraph size="xl">
                  <li>Showing more negative reviews unless businesses pay you = more money.</li>
                </DishParagraph>
              </ul>

              <DishParagraph size="xxl">
                And on and on. You may say,{' '}
                <b>
                  "but you can make a huge list like this for almost any type of business! But most
                  businesses respond to the market, so they tend not to do overtly evil things!"
                </b>
              </DishParagraph>

              <DishParagraph size="xxl">
                Well, that's the thing. The pernicious thing about rankings and reviews is that they
                can be <b>quiet</b>. Just a few reviews hidden, a half star boost, and a little
                shuffling to let poorly ranked places show up high, and boom, no one notices.
              </DishParagraph>
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
              I do think the <b>how</b> of making the best guide in the world is really interesting.
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
              <em>They're using the tool terribly,</em> and that means I have to write a boring and
              long blog post about virtual cats when all I want to do is build a more equitable
              Yelp.
            </DishParagraph>
          </ContentSection>
        </Theme>
      </VStack>
    </>
  )
}

const Highlight = (props: TextProps) => {
  return <Text paddingHorizontal={8} paddingVertical={2} {...props} />
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
      <HStack pointerEvents="none" zIndex={1} position="absolute" fullscreen>
        <VStack
          zIndex={1000}
          position="absolute"
          top={-200}
          left="50%"
          right={0}
          bottom={0}
          overflow="hidden"
        >
          <AbsoluteVStack
            top={250}
            right={0}
            className="slant-bg transform-origin-tl"
            width="100vw"
            height={500}
            transform={[
              {
                rotate: '-5deg',
              },
              {
                scaleX: 1.5,
              },
            ]}
          />
        </VStack>
        <VStack
          zIndex={1000}
          position="absolute"
          top={-200}
          right="50%"
          left={0}
          bottom={0}
          overflow="hidden"
        >
          <AbsoluteVStack
            top={250}
            left={0}
            className="slant-bg transform-origin-tr"
            width="100vw"
            height={500}
            transform={[
              {
                rotate: '5deg',
              },
              {
                scaleX: 1.5,
              },
            ]}
          />
        </VStack>
      </HStack>
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
    <svg style={{ pointerEvents: 'none' }} viewBox="7.5 0 60 10">
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
