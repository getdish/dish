import './site.css'
import './assets/font-gteesti/stylesheet.css'

import React, { useRef } from 'react'
import {
  AbsoluteVStack,
  Button,
  Circle,
  Grid,
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
  useTheme,
} from 'snackui'

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
  const theme = useTheme()
  return (
    <Text
      className="title-font"
      selectable
      alignSelf="center"
      color={theme.color}
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

        <ContentSection marginTop={-90} marginHorizontal="auto" zIndex={900}>
          <DishParagraph textAlign="center" sizeLineHeight={0.8} size={3.9}>
            <b>
              <Highlight backgroundColor="var(--teal)" color="#fff">
                lists for the real world.
              </Highlight>
            </b>
          </DishParagraph>
          <DishParagraph textAlign="center" sizeLineHeight={0.9} size={2.25}>
            <Highlight backgroundColor="#000" color="#fff">
              A social&nbsp;network meets a map.
            </Highlight>
          </DishParagraph>

          <Theme name="light">
            <Join />
          </Theme>

          <DishParagraph textAlign="center" size="xxxl">
            Dish crawls the entire web for quality reviews and information on every restaurant,
            landmark, and more.
          </DishParagraph>

          <Grid itemMinWidth={270}>
            <VStack padding={18}>
              <DishParagraph size="xl">
                <b
                  style={{ padding: 2, margin: -2, background: '#00000055', color: 'var(--pink)' }}
                >
                  Honestly better ratings
                </b>{' '}
                & searches across all review sites and delivery services at once 🚗
              </DishParagraph>
            </VStack>
            <VStack padding={18}>
              <DishParagraph size="xl">
                <b
                  style={{ padding: 2, margin: -2, background: '#00000055', color: 'var(--teal)' }}
                >
                  Playlists IRL
                </b>{' '}
                Vote, rank and explore things to eat, do, and unique hole-in-the-walls in each
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
                  Curate, earn
                </b>{' '}
                Smart contracts payout for good content, moderation, fraud prevention and more.
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
                  Personal
                </b>{' '}
                plan a trip, share highlights with and follow friends & see what chefs with similar
                taste recommend.
              </DishParagraph>
            </VStack>
          </Grid>

          <DishParagraph textAlign="center" size="xxxl">
            We've built a fun app for curating your favorite things: coffee shops to work at, your
            top 5 BBQ places, and more. But there's a big question:
          </DishParagraph>

          <DishParagraph fontWeight="800" textAlign="center" size="xxxl">
            How do you trust it will last?
          </DishParagraph>

          <Spacer />
        </ContentSection>
      </VStack>

      <Theme name="light">
        <VStack
          overflow="hidden"
          paddingTop={100}
          marginVertical={-180}
          pointerEvents="none"
          zIndex={10000}
          position="relative"
        >
          <VStack
            className="shadow-above"
            height={200}
            marginTop={-100}
            alignItems="flex-end"
            justifyContent="flex-end"
            minWidth={1200}
            pointerEvents="none"
            zIndex={200}
            transform={[{ scaleX: 7 }, { translateX: -200 }]}
          >
            <Wave direction="vertical" />
          </VStack>

          <DishTitleSlanted
            fontWeight="600"
            backgroundColor="pink"
            marginTop={-20}
            zIndex={1000}
            alignSelf="center"
          >
            what we see in decentralization
          </DishTitleSlanted>

          <VStack
            marginBottom={-60}
            paddingVertical={10}
            paddingTop={60}
            marginTop={-60}
            position="relative"
            className="yellow-section"
          >
            <ContentSection paddingTop={40} paddingVertical={0}>
              <DishParagraph fontWeight="800" size={3} textAlign="center" size="xxxxxl">
                A new way to run companies
              </DishParagraph>

              <DishParagraph textAlign="center" size="xxxl" sizeLineHeight={0.95}>
                lorem
              </DishParagraph>

              <DishParagraph textAlign="center" size="xl" sizeLineHeight={0.95}>
                With DishCoin{' '}
                <Text marginVertical={-2}>
                  <LogoCircle scale={0.7} />
                </Text>{' '}
                we're incentivizing good photos, lists, reviews and organization.
              </DishParagraph>

              <DishParagraph textAlign="center" sizeLineHeight={0.8} fontWeight="800" size={2}>
                <Highlight backgroundColor="#000" color="#fff">
                  read the whitepaper
                </Highlight>
              </DishParagraph>
            </ContentSection>
            <Spacer size="xxxl" />
          </VStack>

          <VStack
            className="shadow-below"
            height={200}
            alignItems="flex-end"
            justifyContent="flex-end"
            minWidth={1200}
            pointerEvents="none"
            zIndex={100000}
            transform={[{ rotate: '180deg' }, { scaleX: 7 }, { translateX: -200 }]}
          >
            <Wave direction="vertical" />
          </VStack>
        </VStack>
      </Theme>

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
                  { rotate: `-${2 * (i % 3) * 5}deg` },
                  { translateX: i % 2 == 0 ? 150 : 0 },
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

        <ContentSection paddingTop={200} zIndex={10}>
          <VStack overflow="hidden" spacing="xxxl">
            <DishParagraph size="xxxxl">Insert nice letter here.</DishParagraph>

            {/* <DishParagraph size="xxxxl">
              It's 2033, your virtual CryptoKitty, Jerry, nestles ethereally among excel sheets in
              your lap. You smile at the glowing bugger.
            </DishParagraph>

            <DishParagraph size="xxl">
              “Should we reschedule the dentists tomorrow?” Jerry asks, “with traffic, you'll miss
              the matinee." You sigh and look down, “is the minute I finish work really the time for
              this, Jer?”
            </DishParagraph>
            <DishParagraph size="xxl">
              Still, give Jerry credit. You had forgetten the matinee. “Going to the mat-in-ay...”
              you repeat out loud, “the <b>mat</b>
              -in-ayyyy...” hangs on your mouth. “Am I forgetting something, Jer?”
            </DishParagraph>

            <DishParagraph size="xxl">
              The compressor clicks. “Wait a second... the matinee... <b>Matt</b>... his birthday's
              tomorrow! Jer, how'd you forget?”
            </DishParagraph>

            <DishParagraph size="xxl">
              “I didn't! I knew you'd forget, so got him a 1-of-1000{' '}
              <b>Kaws paisley Handkerchief NFT</b>, a 98% likelihood of being a big success with
              Matt, and 88% match to your personality profile.”
            </DishParagraph> */}

            <DishParagraph opacity={0.7} textAlign="center" size="xl">
              Hidden, faked, averaged, inflated.
              <br />
              Pressure to grow fast + easy ad cash 💸,
              <br />
              advertisers hate to be hated.
            </DishParagraph>
          </VStack>
        </ContentSection>
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
                placeholder="Get on the early access list"
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
                textProps={{
                  fontWeight: '800',
                }}
                alignSelf="center"
                glint={false}
              >
                Add email
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
