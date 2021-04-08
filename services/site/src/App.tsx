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
      fontSize="5vw"
      {...(media.sm && {
        fontSize: 44,
      })}
      {...(media.xl && {
        fontSize: 64,
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

        <VStack height={120} alignItems="center" justifyContent="center">
          <DishTitleFitted>real world pokédex</DishTitleFitted>
        </VStack>

        <DishParagraph
          color="rgba(255,255,255,0.65)"
          size="xxl"
          sizeLineHeight={0.9}
          textAlign="center"
        >
          a guide to the world,
          <br />
          powered by a community,
          <br />
          incenvitized by a coin.
        </DishParagraph>

        <Spacer size="xl" />

        <VStack className="float-up-down">
          <VStack
            alignSelf="center"
            shadowColor="#000"
            shadowRadius={60}
            shadowOpacity={0.5}
            shadowOffset={{
              width: -20,
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
          marginTop={-480}
          paddingTop={500}
          className="purple-bg"
          backgroundColor="#af10fe"
        >
          <Circle
            position="absolute"
            className="head-circle"
            top={-940}
            size={1260}
            backgroundColor="#000"
            alignSelf="center"
          />

          <Container marginHorizontal="auto">
            <ContentSection paddingTop={0}>
              <DishParagraph textAlign="center" fontWeight="800" size="xxxxl">
                Review platforms keep failing us.
              </DishParagraph>

              <DishParagraph size="xxxl">
                Reviews are hidden and faked. VC pressure to grow sacrifices product. Pleasing
                advertisers leads to unopinionated rankings.
              </DishParagraph>

              <DishParagraph size="xxxl">
                Sure, a new startup can come along and fix it, but in time they will fall for the
                same old pressures.
              </DishParagraph>

              <DishParagraph size="xxxl">
                Dish wants to solve reviews long-term by by tying{' '}
                <b>a strong single-identity system</b> that retains privacy to a{' '}
                <b>incentivizing coin</b>, and a non-profit that keeps the core team <b>small</b>{' '}
                forever. This should allow:
              </DishParagraph>

              <ul style={{ marginLeft: 40 }}>
                <DishParagraph size="xxl">
                  <li>Deliberate, slow growth. No VC sell-out pressure.</li>
                </DishParagraph>
                <Spacer />
                <DishParagraph size="xxl">
                  <li>Early adopter buy-in and organic, heirachical leadership.</li>
                </DishParagraph>
                <Spacer />
                <DishParagraph size="xxl">
                  <li>Rewarding users for work, leading to better content.</li>
                </DishParagraph>
              </ul>
            </ContentSection>
          </Container>
        </VStack>

        <ContentSection marginHorizontal="auto">
          <DishParagraph size="xxxl">
            It's 2038 and your Apple VR CryptoKitty, Jerry, nestles ethereally on your lap. He looks
            up at you cloyingly, so you wave away the excel sheets.
          </DishParagraph>

          <DishParagraph size="xxxl">
            "Should we reschedule the dentists tomorrow?" he asks, "you have that matinee with your
            mom, and traffics looking to be not-so-good."
          </DishParagraph>

          <DishParagraph size="xxxl">
            "Jerry," you sigh... "is the minute I finish work really the time to be reminding me of
            dentists, traffic, and <b>matinees</b>?"
          </DishParagraph>

          <DishParagraph size="xxl">Sheesh.</DishParagraph>

          <DishParagraph size="xxl">
            For some reason though the word matinee reverberates in your mind... "<b>mat</b>
            -in-ayy..." you repeat out loud, "mat-in-ay".
          </DishParagraph>

          <DishParagraph size="xxl">
            "Wait a second... <b>Matt</b>!" you jump up, passing clean through Jerry, who's hair
            raises. "Matt's birthday dinner... is tomorrow!"
          </DishParagraph>

          <DishParagraph size="xxl">
            Holy cow, you had almost forgot. There's no way you can make it... you have the damn{' '}
            <b>matinee</b>. But you've got to do <em>something</em>.
          </DishParagraph>

          <DishParagraph size="xxl">Luckily, Jerry has an idea:</DishParagraph>

          <DishParagraph size="xxxl">
            "How about this, a{' '}
            <b>1-of-100 limited edition paisley, Kaws x Apple CryptoKitty VR Handkerchief</b> for
            Matt's kitty - and it's only $150."
          </DishParagraph>

          <DishParagraph size="xxl">
            Brilliant. Without a moments hestitation you buy it, record a quick voice note, and{' '}
            <b>boom</b>. Matt'll be happy, mom'll be happy, and Jerry is practically purring with
            delight.
          </DishParagraph>

          <DishParagraph size="xxxl">
            <b>Yet another NFT success story</b>.
          </DishParagraph>
        </ContentSection>

        <VStack marginVertical={-20} alignItems="center">
          <DishTitleSlanted size="xl" fontWeight="800" backgroundColor="yellow" color="#000">
            Wait a second...
          </DishTitleSlanted>
        </VStack>

        <ContentSection marginHorizontal="auto">
          <DishParagraph size="xxxl">You must be confused.</DishParagraph>

          <DishParagraph size="xxxxl">
            What the hell does any of that have to do with a '<b>real world pokedex</b>', and why
            the NFT fiction?
          </DishParagraph>

          <DishParagraph size="xxxl">
            <b>What do CryptoKitty NFTs have to do with Dish?</b>
          </DishParagraph>

          <DishParagraph size="xxxl">
            The good news is: <b>nothing</b>.
          </DishParagraph>

          <DishParagraph size="xxxl">
            The whole Jerry story is just to make the point that{' '}
            <b>the crypto world is a lot like all tech: it can be used for good, bad, or silly</b>.
          </DishParagraph>

          <DishParagraph size="xxxxl">
            I'll be the first to say that basically all NFT's today are worthless, especially ones
            of a gif or blog post - they're <b>stupid</b>.
          </DishParagraph>

          <DishParagraph size="xxxl">
            But some day a unique VR paisley handkerchief may actually be a decent, if silly, gift
            for someone. Because it will be an in-game item that you can't replicate, and your
            friend may really like it.
          </DishParagraph>

          <DishParagraph size="xxl">
            I just felt like writing that all out because it seems anytime anyone comes around with
            a new coin it's usually full of hot air, and given the{' '}
            <em>incredible amount of work</em> we've put into dish, that's entirely non-crypto
            related at all, it feels like even mentioning a coin just earns justified disdain.
          </DishParagraph>

          <DishParagraph fontWeight="800" size="xxxl">
            I get it.
          </DishParagraph>

          <DishParagraph size="xxxl">
            It even took me a lot of convincing - even once I ackowledged it was probably a good
            idea on just the technical merits. It's easy to see a bubble and dismiss 100% of what's
            inside it, but I've come around to thinking that there are some great uses for crypto
            outside buying drugs on the dark web. Hell, Amazon was created near peak-dot-com bubble,
            and they've done alright.
          </DishParagraph>

          <DishParagraph size="xxl">
            I think it'd be nice to give myself a chance to explain <em>why</em> I feel a coin can
            actually be incredibly compelling for bootstrapping communities, in particular. But
            first, what is Dish?
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
                Yea, so these things already exist. It's not rocket science 🚀. But we are doing a
                few things differently - we think the ratings systems in general are failing us, and
                we've done some really cool things to improve them.
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
