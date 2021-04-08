import './assets/font-gteesti/stylesheet.css'
import './site.css'

import React, { useEffect } from 'react'
import { Paragraph, StackProps, Text, VStack, defaultMediaQueries, useMedia } from 'snackui'
import { Title } from 'snackui'
import { Spacer } from 'snackui'
import { TitleProps } from 'snackui'
import { Theme } from 'snackui'
import { Circle } from 'snackui'
import { ParagraphProps } from 'snackui'
import { TextProps } from 'snackui'

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

        <VStack height={150} alignItems="center" justifyContent="center">
          <DishTitleFitted>real world pokédex</DishTitleFitted>
        </VStack>

        <VStack className="float-up-down">
          <VStack
            alignSelf="center"
            backgroundColor="#333"
            padding={8}
            borderRadius={28}
            shadowColor="blue"
            shadowRadius={100}
            shadowOpacity={0.5}
            marginTop={-60}
            marginBottom={-60}
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
            top={-940}
            size={1260}
            backgroundColor="#000"
            alignSelf="center"
          />

          <Container marginHorizontal="auto">
            <ContentSection>
              <DishParagraph size="xxxl">
                It's 2028 and your Apple VR CryptoKitty, Jerry, nestles on your lap with a ethereal
                calm while you work. He looks up at you as you wave away some excel sheets and asks,
                "should we reschedule the dentists tomorrow? You have that matinee with your mom,
                and traffic looks not-so-good."
              </DishParagraph>

              <DishParagraph size="xxxl">
                "Jerry," you sigh... "is the minute I finish work really the time to be reminding me
                of dentists, traffic, and <b>matinees</b>?"
              </DishParagraph>

              <DishParagraph size="xxl">
                Sheesh. Still, the word matinee for some reason sticks in your mind... "<b>mat</b>
                -in-ay.. with mom" you repeat.
              </DishParagraph>

              <DishParagraph size="xxl">
                "Wait a second... <b>Matt</b>!" you jump up, passing right through Jerry. "Matt's
                birthday dinner is tomorrow, too!"
              </DishParagraph>

              <DishParagraph size="xxl">
                Holy cow, you almost forgot - and he's like, your best friend! But there's no way
                you can make it... you have the <em>matinee</em>.
              </DishParagraph>

              <DishParagraph size="xxl">Luckily, Jerry has just the solution:</DishParagraph>

              <DishParagraph size="xxxl">
                He shows you a sweet little NFT, a{' '}
                <b>1-of-100, paisley, Kaws x Apple CryptoKitty Handkerchief</b> for Matt's own kitty
                - and it's only $150.
              </DishParagraph>

              <DishParagraph size="xxl">
                You hit purchase, record a voice note (reminding him how much he likes paisley), and{' '}
                <b>boom</b>. Matt's happy, mom's happy, and Jerry purrs with delight.
              </DishParagraph>

              <DishParagraph size="xxxl">
                <b>Yet another NFT success story</b>.
              </DishParagraph>
            </ContentSection>
          </Container>
        </VStack>

        <VStack marginVertical={-20} alignItems="center">
          <DishTitleSlanted size="xl" fontWeight="800" backgroundColor="yellow" color="#000">
            Wait a second...
          </DishTitleSlanted>
        </VStack>

        <ContentSection marginHorizontal="auto">
          <DishParagraph size="xxxl">
            You (as in you you, not 2028 you) must be confused.
          </DishParagraph>

          <DishParagraph size="xxxxl">
            What the hell does a <b>real world pokedex</b> have to do with futuristic CryptoKitty
            NFTs?
          </DishParagraph>

          <DishParagraph size="xxxl">
            The good news is: <b>nothing</b>.
          </DishParagraph>

          <DishParagraph size="xxxl">
            The whole Jerry thing is just to show that{' '}
            <b>the crypto world is like any other: it can be used for good, silly, or bad</b>.
          </DishParagraph>

          <DishParagraph size="xxxxl">
            <b>
              And I'll be the first to say that an NFT of a gif or blog post, or any other thing you
              can already see on the internet, is, well, stupid.
            </b>
          </DishParagraph>

          <DishParagraph size="xxxl">
            But some day a unique VR paisley handkerchief may actually be a decent, if silly, gift
            for someone. At least then it's hard to replicate.
          </DishParagraph>

          <DishParagraph size="xxl">
            The funny thing is <b>Dish has nothing to do with NFTs at all</b>, in fact, it was
            designed and built entirely without crypto in mind.
          </DishParagraph>

          <DishParagraph size="xxl">
            But we're launching it with a coin, because we think a coin <em>can</em> be{' '}
            <b>immensely valuable</b>, if used for the right purpose.
          </DishParagraph>

          <DishParagraph size="xxxl">
            And it took us a lot of convincing, but in the end, we think it actually makes a whole
            lot of sense. At least, more than the handkercheif.
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
              <DishParagraph size="xxxl">Maybe it's time to explain Dish? Here:</DishParagraph>

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
                We're not claiming to be anything crazy new, app-wise. But we are doing a few things
                differently - we're making it fun, social, and open.
              </DishParagraph>

              <DishParagraph size="xxl">
                But one of the more important things we're doing is we're thinking really hard about
                how to design something that <b>maintains high quality over time</b> and{' '}
                <b>doesn't sell out to advertisers and pressure from VC's to grow</b>.
              </DishParagraph>

              <DishParagraph size="xxxxl">The key? 🔑</DishParagraph>

              <DishParagraph size="xxxl">
                Well, it's not that simple. It will take a lot of hard work from a passionate team,
                and focus on value and users at every step.
              </DishParagraph>

              <DishParagraph size="xxxl">
                But we do have one idea for how we keep our community invested and incentivized to
                pursue quality, and that's a coin: DishCoin, that is.
              </DishParagraph>
            </ContentSection>
          </VStack>
        </Theme>

        <VStack marginTop={-20} alignItems="center">
          <DishTitleSlanted size="lg" fontWeight="800" backgroundColor="yellow" color="#000">
            It uses a coin
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
