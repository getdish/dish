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
        className="before-bg purple-bg"
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
                <DishParagraph size="xxxl">Pressure to grow fast + easy ad cash 💸</DishParagraph>
                <br />
                <DishParagraph size="xxl">(but advertisers hate to be hated).</DishParagraph>
              </DishParagraph>

              <DishParagraph size="xxl">
                Growing fast is good for many types of companies, but when you make{' '}
                <em>recommendations for products</em> it presents problems. Advertisers don't like
                bad reviews, simple as that.{' '}
                <b>
                  Having your income stream being actively against your company's purpose just
                  doesn't work.
                </b>
              </DishParagraph>

              <DishParagraph size="xl">
                There's a single example that seems to have stood the test of time of providing
                quality reviews: <b>ConsumerReports</b>. A non-profit, without ads. One example
                doesn't prove a lot. But we think the the non-profit part is foundational.
              </DishParagraph>

              <DishParagraph size="xl">
                We also think our users need to be paid for their content. That's just table-stakes
                for todays startups, but doesn't exist in the review world. Of course that can
                invite problems, but we have plans for that. Read more on the blog.
              </DishParagraph>

              <DishParagraph size="xl">
                We think a <b>non-profit</b> married to a <b>community coin</b> solves for:
              </DishParagraph>

              <ul style={{ marginLeft: 40 }}>
                <DishParagraph size="xl">
                  <li>Slower growth, focus on quality.</li>
                </DishParagraph>
                <Spacer />
                <DishParagraph size="xl">
                  <li>Incentivizing early adopters for good content and sharing.</li>
                </DishParagraph>
                <Spacer />
                <DishParagraph size="xl">
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
                      more about the crypto stuff ⬇️
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

        <VStack zIndex={2} marginTop={-40} className="toggle-section" position="relative">
          <AbsoluteVStack pointerEvents="none" top={0} left={-300} right={-300} minWidth={2000}>
            {[...new Array(10)].map((_, i) => {
              return (
                <VStack
                  opacity={0.08}
                  key={i}
                  marginBottom={-220}
                  transform={[
                    { scaleX: 2.5 },
                    { rotate: `-20deg` },
                    { translateX: i % 2 == 0 ? 230 : 0 },
                  ]}
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
            <DishParagraph textAlign="center" size="xl">
              ⚠️ Unecessary fictional prologue ⚠️
            </DishParagraph>
            <DishParagraph size="xxxxl">
              It's 2033, an augmented reality CryptoKitty, Jerry, nestles among ethereal excel
              sheets in your lap. You smile at the glowing kitty.
            </DishParagraph>
            <DishParagraph size="xxl">
              “Should we reschedule the dentists?” a stretching Jerry says, “with traffic, you'd
              miss the matinee tomorrow."
            </DishParagraph>
            <DishParagraph size="xxl">
              You sigh, tilting your head forward. “Is the minute I finish work really the time to
              be reminding me of dentists and traffic?”
            </DishParagraph>
            <DishParagraph size="xxl">
              Still, you have to give Jerry credit. You <b>did</b> forget about the matinee. You tap
              your fingers on your chin. “The mat-in-ay...” you repeat out loud, “<b>mat</b>
              -in-ayyyy. What am I forgetting, Jer?”
            </DishParagraph>

            <DishParagraph size="xxl">
              The compressor clicks. You jump up, “wait a second... <b>Matt</b>... his birthday's
              tomorrow! Jer, how did you forget that?”
            </DishParagraph>

            <DishParagraph size="xxl">
              “I didn't. We'll just get him this 1-of-1000 <b>Kaws paisley Handkerchief NFT</b>,
              perfect for his kitty” Jerry offers without hesitation, “only $20.”
            </DishParagraph>

            <VStack alignItems="center">
              <DishTitleSlanted fontWeight="800" backgroundColor="#000" color="#fff">
                Should you do it?
              </DishTitleSlanted>
            </VStack>

            <DishParagraph size="xxxl">It depends. Does Matt like CryptoKitties?</DishParagraph>

            <DishParagraph size="xxl">Do their NFT's hold value?</DishParagraph>

            <DishParagraph size="xxl">
              To get to the point, the long run value of any crypto project should be judged on two
              things: how good the <b>non-crypto part is</b> (eg, Jerry), and{' '}
              <b>if a chain/coin add value</b>.
            </DishParagraph>

            <DishParagraph size="xxl">
              Dish works without a coin. It's simply a great app. We expect to compete entirely
              based on the app itself.
            </DishParagraph>

            <DishParagraph size="xxl">
              But we think a coin is a really smart way to grow it more sustainably and distribute
              equity more fairly than traditional VC.
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
                  <Highlight backgroundColor="var(--teal)" color="#fff">
                    a pocket guide to the world
                  </Highlight>{' '}
                  <Text fontWeight="200">starting with food</Text>
                </b>
              </DishParagraph>

              <Join />

              <ul style={{ marginLeft: 40 }}>
                <VStack spacing="xl">
                  <DishParagraph size="xxl">
                    <li>
                      <b>Playlists of the world.</b> Top dishes 🍽, nights out 🌃, cafes ☕️, you
                      name it - a fun place to find and curate real-world things.
                    </li>
                  </DishParagraph>
                  <DishParagraph size="xxl">
                    <li>
                      <b>Give content creators equity.</b> Stop giving free content to massively
                      profitable companies, get paid like you do on Youtube or TikTok.
                    </li>
                  </DishParagraph>
                  <DishParagraph size="xxl">
                    <li>
                      <b>A social, explorable map of the world.</b> Find gems 💎 broken down by
                      neighborhood on a realtime map, suited to your taste.
                    </li>
                  </DishParagraph>
                  <DishParagraph size="xxl">
                    <li>
                      <b>Search every delivery service 🚗</b> with ratings down to the dish.
                    </li>
                  </DishParagraph>
                </VStack>
              </ul>

              <VStack alignItems="center">
                <DishTitleSlanted size="sm" backgroundColor="var(--pink)" color="#fff">
                  What's different
                </DishTitleSlanted>
              </VStack>

              <DishParagraph size="xxl">
                <b>Review platforms sell out.</b> We're looking to fix that. In short, with three
                things: a non-profit that distributes equity to our community, a platform that
                builds in guarantees on a blockchain, and a product focused team that stays small.
              </DishParagraph>

              <VStack alignItems="center">
                <DishTitleSlanted size="sm" backgroundColor="var(--pink)" color="#fff">
                  The Coin
                </DishTitleSlanted>
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
                <DishTitleSlanted size="sm" backgroundColor="var(--pink)" color="#fff">
                  The mission
                </DishTitleSlanted>
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
