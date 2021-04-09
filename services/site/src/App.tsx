import './assets/font-gteesti/stylesheet.css'
import './site.css'

import React from 'react'
import {
  Circle,
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

        <VStack height={130} alignItems="center" justifyContent="center">
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

        <Spacer size="xxl" />

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
          className="purple-bg"
          backgroundColor="#af10fe"
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
              <DishParagraph textAlign="center" fontWeight="800" size="xxxxl">
                Review platforms keep failing us.
              </DishParagraph>

              <DishParagraph size="xxxl">
                Hidden & faked reviews. VC pressure to grow sacrificing product. Fear of advertisers
                = unopinionated rankings. And no fun to be had anywhere.
              </DishParagraph>

              <DishParagraph size="xxl">
                Sure, a new startup can come along and fix it, for a while, but ultimately they'll
                raise money, see 💸 signs, and... the cycle repeats.
              </DishParagraph>

              <DishParagraph size="xxl">
                Dish aims to solve the bigger problem by tying a strong, referral-based{' '}
                <b>single-identity system</b> that allows anonymity, to an{' '}
                <b>incentivizing community-owned coin</b>, and finally, a{' '}
                <b>non-profit organization</b>, led by a small team of experienced tech product
                developers.
              </DishParagraph>

              <DishParagraph size="xxl">
                It's web 3.0, with a real product. Think this model unlocks:
              </DishParagraph>

              <ul style={{ marginLeft: 40 }}>
                <DishParagraph size="xxl">
                  <li>Deliberate, slow growth without the downsides of VC pressure.</li>
                </DishParagraph>
                <Spacer />
                <DishParagraph size="xxl">
                  <li>Early adopter buy-in, ownership and leadership.</li>
                </DishParagraph>
                <Spacer />
                <DishParagraph size="xxl">
                  <li>Users being rewarded for their work, leading to better content.</li>
                </DishParagraph>
              </ul>

              <Spacer />
            </ContentSection>
          </Container>
        </VStack>

        <VStack backgroundColor="var(--second-section-bg)" position="relative">
          <ContentSection marginHorizontal="auto">
            <>
              <Slants />
              <DishParagraph size="xxxl">
                It's 2038 and your Apple VR CryptoKitty, Jerry, nestles ethereally on your lap. He
                looks up at you cloyingly, so you wave away the excel sheets.
              </DishParagraph>
            </>

            <DishParagraph size="xxxl">
              "Should we reschedule the dentists tomorrow?" he asks, "you have that matinee with
              your mom, and traffics looking to be not-so-good."
            </DishParagraph>

            <DishParagraph size="xxxl">
              "Jerry," you sigh, "is the minute I finish work really the time to be reminding me of
              dentists and traffic and <b>matinees</b>?"
            </DishParagraph>

            <DishParagraph size="xxl">
              Sheesh... he's a cute bugger, but they still haven't really figured out <b>timing</b>{' '}
              with these things. But, for some reason, the words reverberate in your mind...
              dentist, traffic, matinee. Why is that ringing a bell? "Mat-in-<b>ayy</b>..." you
              repeat out loud, "<b>mat</b>
              -in-ay"...
            </DishParagraph>

            <DishParagraph size="xxl">
              Wait a second... "<b>Matt</b>!" you jump up, passing clean through Jerry, who's hair
              raises. "Matt's birthday dinner is... tomorrow!"
            </DishParagraph>

            <DishParagraph size="xxl">
              Holy cow, you forgot to tell Jerry about it altogether. It's a miracle you remembered.
              But there's no way you can make it... you have the <b>matinee</b>. Still... you've got
              to do <em>something</em>.
            </DishParagraph>

            <DishParagraph size="xxl">Lucky for you, Jerry has an idea:</DishParagraph>

            <DishParagraph size="xxxl">
              "How about a{' '}
              <b>1-of-100 limited edition paisley, Kaws x Apple CryptoKitty VR Handkerchief</b> for
              Matt's kitty Jeff - it's only $150."
            </DishParagraph>

            <DishParagraph size="xxl">
              Brilliant. Without a moments hestitation you buy it, wrap it with a voice note,
              reschedule the dentists and <b>boom</b>. Matt, mom, the dentist - all taken care of.
              Jerry purrs with satisfication.
            </DishParagraph>

            <DishParagraph size="xxxl">
              <b>Yet another NFT success story, right?</b>
            </DishParagraph>
          </ContentSection>
        </VStack>

        <VStack marginVertical={-20} alignItems="center">
          <DishTitleSlanted size="xl" fontWeight="800" backgroundColor="yellow" color="#000">
            It's complicated
          </DishTitleSlanted>
        </VStack>

        <ContentSection marginHorizontal="auto">
          <DishParagraph size="xxxl">
            First of all, I think the above story is an example of an alright use of crypto, in some
            distant future.
          </DishParagraph>

          <DishParagraph size="xxl">
            At least the handkerchief is an animated in-game asset that isn't just freely available
            for anyone else. <b>That said</b>, the only point of the whole Jerry story is just show
            it's hard to understand how to draw the line between good and bad uses of any
            technology.
          </DishParagraph>

          <DishParagraph size="xxxl">
            <b>So what in the world do NFTs have to do with Dish?</b>
          </DishParagraph>

          <DishParagraph size="xxxl">
            The good news is, <b>they don't</b>.
          </DishParagraph>

          <DishParagraph size="xxl">
            Some day a unique VR paisley handkerchief may actually be a decent, if silly, gift for
            someone. But we risk losing a lot in manically chasing money for value-less things.
          </DishParagraph>

          <DishParagraph size="xxxl">
            All the value of any crypto offering outside of being a security (rare) or a currency
            (also rare) is in <b>how real and good the product behind it is</b>.
          </DishParagraph>

          <DishParagraph size="xxl">
            That's the point. You can't just add "crypto" to some half-baked app or gif and make it
            worth something. At least not outside of a bubble. The NFT bubble today is being
            entirely driven by a few insiders self-dealing, a bunch of grifters hoping to ride the
            wave, and a few unfortunate suckers.
          </DishParagraph>

          <DishParagraph fontWeight="800" size="xxxl">
            So, what's the deal?
          </DishParagraph>
        </ContentSection>

        <VStack marginVertical={-20} alignItems="center">
          <DishTitleSlanted size="xl" fontWeight="800" backgroundColor="yellow" color="#000">
            With that said...
          </DishTitleSlanted>
        </VStack>

        <Theme name="light">
          <VStack backgroundColor="#feac20" marginTop={-30}>
            <ContentSection marginHorizontal="auto">
              <DishParagraph size={5}>
                <b>
                  <Highlight backgroundColor="red" color="#fff">
                    Dish is a pocket guide to the world
                  </Highlight>
                </b>
              </DishParagraph>

              <DishParagraph size="xxxl">
                <b>Honestly, it's a lot like Yelp or Google Maps, or TripAdvisor.</b> Or FourSquare.
                Remember FourSquare?
              </DishParagraph>

              <DishParagraph size="xxl">
                And the cool thing is <b>it actually already exists</b> and the team behind it is a
                team of experience product people who've done this before.
              </DishParagraph>

              <DishParagraph size="xxxxl">It's not rocket science 🚀, for sure.</DishParagraph>

              <DishParagraph size="xxl">
                But we are doing a few things differently - we think the ratings systems in general
                are failing us, and we've done some really cool things to improve them.
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
                Before the whole coin thing ever even became a twinkle of an idea, Dish was years in
                the making. We've spent grueling months designing something that's beautiful, and
                works well - <b>even without a drop of crypto</b>.
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

        <VStack marginTop={-20} alignItems="center">
          <DishTitleSlanted size="lg" fontWeight="800" backgroundColor="yellow" color="#000">
            How a coin saves us from selling out:
          </DishTitleSlanted>
        </VStack>

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
            long blog post about virtual cats when all I want to do is build a more equitable Yelp.
          </DishParagraph>

          <DishParagraph marginLeft={20} size="xl">
            <li>
              A personalized map of the gems 💎 to eat out at or order for delivery, unique to you,
              down to the neighborhood.
            </li>
          </DishParagraph>

          <DishParagraph marginLeft={20} size="xl">
            <li>
              Definitive rankings of the best dishes. We crawl the whole damn web and use "AI"
              (off-the-shelf neural networks) to get sentiment towards each and every dish at each
              and every restaurant. Think RottenTomatoes but for 🌮 and with a great community.
            </li>
          </DishParagraph>

          <DishParagraph marginLeft={20} size="xl">
            <li>
              And <b>playlists</b>. This ones fun. Share your favorite days out, cafe's to work at,
              or a really nice date night as a playlist. Vote, explore, and try out others lists.
            </li>
          </DishParagraph>
        </ContentSection>
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
      spacing="xxxl"
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
        zIndex={-1}
        className="transform-origin-tl"
        backgroundColor="var(--second-section-bg)"
        width="100vw"
        height={300}
        position="absolute"
        top={0}
        left="50%"
        transform={[
          {
            rotate: '-5deg',
          },
        ]}
      />
      <VStack
        zIndex={-1}
        className="transform-origin-tr"
        backgroundColor="var(--second-section-bg)"
        width="100vw"
        height={300}
        position="absolute"
        top={0}
        right="50%"
        transform={[
          {
            rotate: '5deg',
          },
        ]}
      />
    </>
  )
}
