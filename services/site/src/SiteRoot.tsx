import './assets/font-gteesti/stylesheet.css'
import './site.css'

// import jsonp from 'jsonp'
import React, { useRef } from 'react'
import { Image, Pressable } from 'react-native'
import {
  AbsoluteVStack,
  Button,
  Circle,
  HStack,
  Input,
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

import { LogoCircle } from './DishLogo'
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

export const SiteRoot = () => {
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

              <DishParagraph size="xxxxl" sizeLineHeight={0.9}>
                Hidden. Faked. Averaged. Inflated.
                <br />
                <DishParagraph size="xxxl">
                  Pressure to grow fast, easy ad cash 💸,
                  <br />
                  advertisers hate to be hated.
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
              excel sheets. You smile at the glowing kitty as he looks up at you.
            </DishParagraph>
            <DishParagraph size="xxl">
              “Should we reschedule the dentists?” Jerry begins, stretching, “with traffic, you may
              miss the matinee tomorrow."
            </DishParagraph>
            <DishParagraph size="xxl">
              A sigh. “Is the minute I finish work really the time to be reminding me of dentists
              and traffic?"
            </DishParagraph>
            <DishParagraph size="xxl">
              Jerry frowns. He is right. You <b>did</b> forget the matinee, with mom. “The mat-in-ay
              with mom...” you repeat out loud, “<b>mat</b>-in-ay”...
            </DishParagraph>
            <DishParagraph size="xxl">
              The fridge compressor turns on, and something clicks. “Wait a second... <b>Matt</b>!”
              you jump up, right through a startled Jerry. “His birthday's tomorrow! I'll have to
              cancel going... he'll be upset..."
            </DishParagraph>
            <DishParagraph size="xxxl">
              “Why not grab him a 1-of-1000 <b>Kaws paisley Handkerchief NFT</b>,” Jerry offers
              without hesitation, “only $20, plus you guys joked about paisley just last week.”
            </DishParagraph>
            <DishParagraph size="xxl">
              <b>“Done and done!”</b>
            </DishParagraph>

            <VStack alignItems="center">
              <DishTitleSlanted size="lg">Jerry & Dish</DishTitleSlanted>
            </VStack>

            <DishParagraph size="xxxl">
              Crypto is only as valuable as what it's tied to. As a good store of value, a good
              payment system, or a way to drive behavior within a network. Even NFT's can make
              sense, if the product is good: Jerry is a fully animated, augmented reality AI cat.
            </DishParagraph>

            <DishParagraph size="xxl">
              We just a coin works particularly well for bootstrapping a network of content. It
              incentivizes growth by distributing equity more fairly than traditional VC companies.
              It also lets us do all sorts of nice things to foster trust and quality with open,
              codified contracts, governance and more.
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
          pointerEvents="none"
          zIndex={10}
          transform={[{ scaleX: 3.2 }, { translateX: -100 }]}
        >
          <Wave direction="vertical" />
        </VStack>

        <Theme name="light">
          <VStack pointerEvents="auto" className="yellow-section">
            <ContentSection marginTop={-150} marginHorizontal="auto" zIndex={1000}>
              <Spacer />

              <HStack spacing="md" justifyContent="center">
                <Text fontSize={20} paddingHorizontal={10} color="#000">
                  <b>what is dish?</b>
                </Text>
                <label htmlFor="toggle-platforms">
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
                  <Highlight backgroundColor="red" color="#fff">
                    a pocket guide to the world
                  </Highlight>{' '}
                  <Text fontWeight="200">starting with food</Text>
                </b>
              </DishParagraph>

              <Join />

              <DishParagraph size="xxl">
                <b>YouTube and TikTok pay content creators.</b> We're doing the same for the
                explorers of the world, on a beautiful app designed to last.
              </DishParagraph>

              <VStack alignItems="center">
                <DishTitleSlanted backgroundColor="#fff">The App</DishTitleSlanted>
              </VStack>

              <ul style={{ marginLeft: 40 }}>
                <VStack spacing="xl">
                  <DishParagraph size="xxl">
                    <li>
                      <b>find gems 💎 broken down by neighborhood</b>
                    </li>
                  </DishParagraph>
                  <DishParagraph size="xxl">
                    <li>
                      <b>search every delivery service 🚗 at once</b>
                    </li>
                  </DishParagraph>
                  <DishParagraph size="xxl">
                    <li>
                      <b>playlists</b> of top dishes 🍽, nights out 🌃, cafes ☕️, you name it
                    </li>
                  </DishParagraph>
                </VStack>
              </ul>

              <VStack alignItems="center">
                <DishTitleSlanted backgroundColor="#fff">The Coin</DishTitleSlanted>
              </VStack>

              <DishParagraph size="xxl">
                How we solve for <b>steadier growth</b> and <b>quality</b>. Earn DishCoin{' '}
                <Text marginVertical={-2}>
                  <LogoCircle scale={0.7} />
                </Text>{' '}
                for writing, moderating, flagging, labeling, images, tags, lists and comments.
                There's so many ways a content site needs curators, and a coin makes it easy to
                incentivize that, even for small actions.
              </DishParagraph>

              <VStack alignItems="center">
                <DishTitleSlanted backgroundColor="#fff">The mission</DishTitleSlanted>
              </VStack>

              <DishParagraph size="xxl">
                The thing about rankings and reviews is that it's easy for companies to get away
                with <b>quietly manipulating them</b> and degrading over time. Hide a few negative
                comments here, round star counts up, maybe shuffle the search results a bit to let
                poorly ranked places show up.
              </DishParagraph>
            </ContentSection>
          </VStack>
        </Theme>
      </VStack>

      <VStack className="before-bg purple-bg">
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

export class Join extends React.Component<any> {
  state = {
    error: null,
    success: null,
    submitting: false,
  }

  form = React.createRef<HTMLFormElement>()
  email = React.createRef<HTMLInputElement>()
  clearState() {
    this.setState({ error: null, success: null, submitting: false })
  }

  submit = async (e) => {
    console.log('got submit')
    e.preventDefault()
    this.clearState()
    this.setState({ submitting: true })
    try {
      const finish = (state) => {
        this.clearState()
        this.setState(state)
      }
      console.log('this.form', this.form)
      const form = this.form.current
      const query = {
        id: '015e5a3442',
        EMAIL: this.email.current?.value,
        b_019909d3efb283014d35674e5_015e5a3442: '',
      }
      let url = form!.getAttribute('action')?.replace('/post', '/post-json')
      url = `${url}&${queryString(query)}`
      jsonp(url, { param: 'c' }, (error, data) => {
        if (error) {
          return finish({ error })
        }
        if (data && data.result === 'error') {
          return finish({ error: data.msg })
        }
        return finish({ success: data.msg })
      })
    } catch (err) {
      console.log('errrr', err)
      this.clearState()
      this.setState({ error: err.message })
    }
  }
  render() {
    const { success, error, submitting } = this.state
    const { header, inputProps, ...props } = this.props
    const message = success || error || ''
    return (
      <HStack
        maxWidth={500}
        alignSelf="center"
        padding={20}
        backgroundColor="#fff"
        shadowColor="#000"
        shadowOpacity={0.15}
        shadowRadius={60}
        shadowOffset={{ height: 15, width: 0 }}
        borderRadius={20}
      >
        <form
          action="https://tryorbit.us18.list-manage.com/subscribe/post?u=019909d3efb283014d35674e5"
          method="post"
          id="mc-embedded-subscribe-form-1"
          name="mc-embedded-subscribe-form"
          target="_blank"
          ref={this.form}
          onSubmit={this.submit}
        >
          <VStack {...props}>
            {header}

            <HStack spacing>
              <Input
                type="email"
                nodeRef={this.email}
                name="EMAIL"
                id="mce-EMAIL"
                placeholder="Email address..."
                flex={1}
                fontSize={22}
                defaultValue=""
                {...inputProps}
              />
              <Button
                type="submit"
                disabled={submitting}
                opacity={submitting ? 0.5 : 1}
                pointerEvents={submitting ? 'none' : 'auto'}
                cursor="pointer"
                maxWidth={300}
                alignSelf="center"
                glint={false}
              >
                Early access
              </Button>
            </HStack>
          </VStack>
        </form>
        {!!message && (
          <VStack maxWidth={500} marginHorizontal="auto">
            <Spacer size="lg" />
            <Text
              color={success ? 'red' : error ? 'green' : undefined}
              dangerouslySetInnerHTML={{
                __html: message,
              }}
            />
          </VStack>
        )}
      </HStack>
    )
  }
}

const queryString = (query) => {
  const esc = encodeURIComponent
  return Object.keys(query)
    .map((k) => `${esc(k)}=${k === 'c' ? query[k] : esc(query[k])}`)
    .join('&')
}
