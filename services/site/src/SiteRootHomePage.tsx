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
import { Grid } from 'snackui'

import { LogoCircle } from './DishLogo'
import { LogoVertical } from './LogoVertical'

const DishParagraph = (props: ParagraphProps) => {
  return <Paragraph className="title-font" sizeLineHeight={1.1} {...props} />
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
      paddingVertical={12}
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
      <VStack
        position="relative"
        zIndex={0}
        className="before-bg purple-bg purple-bg-fade"
        backgroundColor="var(--purple)"
        overflow="hidden"
      >
        <Container position="relative" zIndex={1} paddingTop={40} marginHorizontal="auto">
          <Circle
            position="absolute"
            className="head-circle"
            top={-580}
            size={1360}
            zIndex={-1}
            alignSelf="center"
          />

          <LogoVertical />

          <Spacer />

          <VStack height={120} alignItems="center" justifyContent="center">
            <DishTitleFitted>real world pokédex</DishTitleFitted>
          </VStack>

          <DishParagraph
            color="rgba(255,255,255,0.65)"
            size="xxl"
            sizeLineHeight={0.9}
            letterSpacing={1.05}
            textAlign="center"
          >
            what's <em>actually</em> good in every neighborhood
            <br />
            <Text letterSpacing={0} fontSize={22}>
              a community, a coin, a non-profit, a guide
            </Text>
          </DishParagraph>
        </Container>

        <Spacer size="xl" />

        <VStack zIndex={1000} position="relative" className="float-up-down">
          <VStack
            alignSelf="center"
            shadowColor="#000"
            shadowRadius={90}
            shadowOpacity={0.65}
            shadowOffset={{
              width: -80,
              height: 120,
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

        <ContentSection marginTop={-85} marginHorizontal="auto" zIndex={900}>
          <DishParagraph textAlign="center" sizeLineHeight={0.8} size={3}>
            <b>
              <Highlight backgroundColor="var(--teal)" color="#fff">
                a pocket guide to the world
              </Highlight>
              <br />
              <Text fontWeight="200" fontSize="50%">
                (just food * playlists for now)
              </Text>
            </b>
          </DishParagraph>

          <Theme name="light">
            <Join />
          </Theme>

          <Grid itemMinWidth={270}>
            <VStack padding={18}>
              <DishParagraph size="xl">
                <b
                  style={{ padding: 2, margin: -2, background: '#00000055', color: 'var(--pink)' }}
                >
                  Best food, down to the dish.
                </b>{' '}
                search every delivery service at once 🚗, and every review on the web.
              </DishParagraph>
            </VStack>
            <VStack padding={18}>
              <DishParagraph size="xl">
                <b
                  style={{ padding: 2, margin: -2, background: '#00000055', color: 'var(--teal)' }}
                >
                  Playlists.
                </b>{' '}
                Your personal favorites are optionally shared, vote and explore top playlists by
                neighborhood.
              </DishParagraph>
            </VStack>
            <VStack padding={18}>
              <DishParagraph size="xl">
                <b
                  style={{
                    padding: 2,
                    margin: -2,
                    background: '#00000055',
                    color: 'var(--yellow)',
                  }}
                >
                  Curate and earn.
                </b>{' '}
                DAO with majority share.
              </DishParagraph>
            </VStack>
            <VStack padding={18}>
              <DishParagraph size="xl">
                <b
                  style={{
                    padding: 2,
                    margin: -2,
                    background: '#00000055',
                    color: 'var(--purple)',
                  }}
                >
                  Trust.
                </b>{' '}
                Follow friends and chefs to get better recommendations as you travel the world for
                you.
              </DishParagraph>
            </VStack>
          </Grid>

          <Spacer />
        </ContentSection>
      </VStack>

      <VStack backgroundColor="#111" position="relative" zIndex={1000}>
        <Slants color="black" />

        <AbsoluteVStack
          zIndex={10}
          pointerEvents="none"
          top={-100}
          left={-300}
          right={-300}
          minWidth={2000}
        >
          {[...new Array(10)].map((_, i) => {
            return (
              <VStack
                opacity={0.08}
                key={i}
                marginBottom={-220}
                transform={[
                  { scaleX: 2.5 },
                  { rotate: `-12deg` },
                  { translateX: i % 2 == 0 ? 200 : 0 },
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

        <ContentSection paddingTop={50} zIndex={10}>
          <DishParagraph textAlign="center" sizeLineHeight={0.8} fontWeight="800" size={4}>
            <Highlight backgroundColor="var(--pink)" color="#fff">
              A network of recommending.
            </Highlight>
          </DishParagraph>

          <DishParagraph size="xxxxl">
            Social networks should be small, personal, and mostly just your friends.
          </DishParagraph>

          <DishParagraph size="xxl">
            Luckily, recommending food is less high stakes than, say, a car. And because there's
            many more reviewers, more places to shop, and lower profit per-purchase, it's harder to
            game.
          </DishParagraph>

          <DishParagraph size="xxl">
            We think by paying our reviewers in DishCoin, it actually lowers the change of any one
            being bought out. It makes sense: making money from your content means you don't need to
            make as much elsewhere.
          </DishParagraph>

          <DishParagraph size="xxl">
            We're adding to this a strict referral-based invite system, tied to a strongly-verified
            single account system (still allowing public anonymity), along with a variety of other
            ways to have moderators validate quality, sub-communities and invitees.
          </DishParagraph>

          <DishParagraph size="xxl">
            The end result is a <b>non-profit</b>, <b>community-owned</b>, with a coin for
            incentivizing good behavior.
          </DishParagraph>

          <DishParagraph opacity={0.7} textAlign="center" size="xl">
            Hidden, faked, averaged, inflated.
            <br />
            Pressure to grow fast + easy ad cash 💸,
            <br />
            advertisers hate to be hated.
          </DishParagraph>
        </ContentSection>
      </VStack>

      <Theme name="light">
        <VStack
          overflow="hidden"
          paddingTop={100}
          marginTop={-100}
          pointerEvents="none"
          zIndex={10000}
          position="relative"
        >
          <VStack
            className="shadow-above"
            height={200}
            marginBottom={-60}
            marginTop={-100}
            alignItems="flex-end"
            justifyContent="flex-end"
            minWidth={1200}
            pointerEvents="none"
            zIndex={100000}
            transform={[{ scaleX: 3.2 }, { translateX: -100 }]}
          >
            <Wave direction="vertical" />
          </VStack>

          <VStack zIndex={1000000} alignItems="center">
            <DishTitleSlanted backgroundColor="var(--pink)" color="#fff">
              What's different
            </DishTitleSlanted>
          </VStack>

          <VStack marginBottom={-60} zIndex={100} position="relative" className="yellow-section">
            <ContentSection paddingVertical={0}>
              <Spacer />

              <DishParagraph size="xxxl">
                <b>Review platforms sell out.</b> We're looking to fix that with three things: a
                non-profit that distributes equity to our community, a platform that gives users
                control on a blockchain, and extreme product focus.
              </DishParagraph>

              <DishParagraph size="xxl">
                The thing about rankings and reviews is that it's easy for companies to get away
                with <b>quietly manipulating them</b> and degrading over time. Hide a few negative
                comments here, round star counts up, maybe shuffle the search results a bit to let
                poorly ranked places show up.
              </DishParagraph>
            </ContentSection>
            <Spacer size="xxxxl" />
          </VStack>

          <VStack
            className="shadow-below"
            height={200}
            alignItems="flex-end"
            justifyContent="flex-end"
            minWidth={1200}
            pointerEvents="none"
            zIndex={100000}
            transform={[{ rotate: '180deg' }, { scaleX: 3.2 }, { translateX: -100 }]}
          >
            <Wave direction="vertical" />
          </VStack>
        </VStack>
      </Theme>

      <VStack marginTop={-200} paddingTop={140} position="relative" backgroundColor="var(--blue)">
        <input id="toggle-story-time" type="checkbox" className="toggle-check" />

        <VStack overflow="hidden" zIndex={2} marginTop={-40} position="relative">
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

          <Theme name="dark">
            <VStack spacing="xxl">
              <ContentSection alignSelf="center">
                <DishParagraph size="xxl">
                  Earn DishCoin{' '}
                  <Text marginVertical={-2}>
                    <LogoCircle scale={0.7} />
                  </Text>{' '}
                  for writing, moderating, flagging, labeling, images, tags, lists and comments.
                  There's so many ways a content site needs curators. A coin makes it easy to
                  incentivize even small contributions.
                </DishParagraph>

                <DishParagraph size="xxl">
                  <b>And now, a story.</b>
                </DishParagraph>

                <DishParagraph size="xxxxl">
                  It's 2033, your virtual CryptoKitty, Jerry, nestles ethereally among excel sheets
                  in your lap. You smile at the glowing bugger.
                </DishParagraph>
                <DishParagraph size="xxl">
                  “Should we reschedule the dentists tomorrow?” Jerry asks, “with traffic, you'll
                  miss the matinee."
                </DishParagraph>
                <DishParagraph size="xxl">
                  You sigh and raise a brow, “is the minute I finish work really the time for this,
                  Jer?”
                </DishParagraph>
                <DishParagraph size="xxl">
                  Still, give Jerry credit. You had forgetten the matinee. “Going to the
                  mat-in-ay...” you repeat out loud, “the <b>mat</b>
                  -in-ayyyy...” hangs in your mouth. “Am I forgetting something, Jer?”
                </DishParagraph>

                <DishParagraph size="xxl">
                  The compressor clicks. “Wait a second... the matinee... <b>Matt</b>... his
                  birthday's tomorrow! Jer, how'd you forget?”
                </DishParagraph>

                <DishParagraph size="xxl">
                  “I didn't! Just get him this 1-of-1000 <b>Kaws paisley Handkerchief NFT</b>, the
                  perfect accessory for his kitty... only $50.”
                </DishParagraph>

                <VStack alignItems="center">
                  <DishTitleSlanted fontWeight="800" backgroundColor="#000" color="#fff">
                    Should you do it?
                  </DishTitleSlanted>
                </VStack>

                <DishParagraph size="xxl">
                  To get to the point, the long run value of any crypto project should be judged on
                  two things: how good the <b>non-crypto part is</b> (eg, Jerry), and{' '}
                  <b>if a chain/coin add value</b>.
                </DishParagraph>

                <DishParagraph size="xxl">
                  Dish works without a coin. It's simply a great app. We expect to compete entirely
                  based on the app itself.
                </DishParagraph>

                <DishParagraph size="xxl">
                  But we think a coin is a really smart way to grow it more sustainably and
                  distribute equity more fairly than traditional VC.
                </DishParagraph>

                <Spacer size="xxxl" />
              </ContentSection>
            </VStack>
          </Theme>
        </VStack>
      </VStack>
    </>
  )
}

const Highlight = (props: TextProps) => {
  return <Text paddingHorizontal={12} paddingVertical={4} borderRadius={3} {...props} />
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
      overflow="hidden"
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

const Slants = ({ color = 'yellow' }: { color?: string }) => {
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
            className={`slant-bg bg-${color} transform-origin-tl`}
            width="100vw"
            height={200}
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
            className={`slant-bg bg-${color} transform-origin-tr`}
            width="100vw"
            height={200}
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
                borderWidth={0}
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
