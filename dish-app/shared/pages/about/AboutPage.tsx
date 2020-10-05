import {
  AbsoluteVStack,
  Divider,
  Paragraph,
  Spacer,
  Text,
  UnorderedList,
  UnorderedListItem,
  VStack,
} from '@dish/ui'
import { useStore } from '@dish/use-store'
import React, { useEffect } from 'react'
import { Image } from 'react-native'

import { StackItemProps } from '../../AppStackView'
import dishWhite from '../../assets/dish-white.jpg'
import dontPanic from '../../assets/dont-panic.svg'
import { BottomDrawerStore } from '../../BottomDrawerStore'
import { bgLight, brandColorDark, lightGreen, lightYellow } from '../../colors'
import { HomeStateItemAbout } from '../../state/home-types'
import { ContentScrollView } from '../../views/ContentScrollView'
import { StackDrawer } from '../../views/StackDrawer'
import { Link } from '../../views/ui/Link'
import { LinkButton } from '../../views/ui/LinkButton'
import { TextStrong } from '../../views/ui/TextStrong'

const inlineButton = {
  borderRadius: 10,
  paddingHorizontal: 6,
  position: 'relative',
} as const

export default function AboutPage({
  item,
  isActive,
}: StackItemProps<HomeStateItemAbout>) {
  const drawerStore = useStore(BottomDrawerStore)

  useEffect(() => {
    if (!isActive) return
    const tm = setTimeout(() => {
      if (drawerStore.snapIndex > 0) {
        drawerStore.setSnapPoint(0)
      }
    }, 350)
    return () => {
      clearTimeout(tm)
    }
  }, [isActive])

  return (
    <StackDrawer closable title="About Dish">
      <ContentScrollView
        paddingTop={20}
        style={{
          flex: 1,
        }}
      >
        <VStack spacing="xl">
          <VStack
            marginLeft={-60}
            marginRight={20}
            paddingLeft={60}
            borderRadius={60}
            maxWidth="100%"
            alignItems="center"
            position="relative"
          >
            <Image
              source={{ uri: dishWhite }}
              style={{
                width: 261 * 1.25,
                height: 161 * 1.25,
                marginTop: -20,
                marginBottom: -40,
              }}
            />
            <Paragraph
              zIndex={10}
              color="#999"
              textAlign="center"
              size={1.1}
              fontWeight="500"
            >
              the better restaurant recommender
            </Paragraph>
          </VStack>

          <Spacer size="sm" />

          <VStack paddingHorizontal="5%" spacing="xl">
            <Paragraph size="xxl">
              Craving pho? Amazing Vietnamese, Chinese, and Mexican spots are
              often hard to find because a single 5-star rating forces food,
              ambiance and service into one dimension. Lets change the world of
              eating out (and in) by fixing food ratings.
            </Paragraph>

            <Paragraph size="lg">
              We think{' '}
              <TextStrong>
                ratings can be improved by throwing away 5 stars
              </TextStrong>
              . The reason hole-in-the-wall restaurants get lost is because
              often they don't cater to service or ambiance. It turns out what
              you care about when ordering{' '}
              <LinkButton
                fontWeight="400"
                backgroundColor={lightYellow}
                hoverStyle={{
                  backgroundColor: `${lightYellow}44`,
                }}
                {...inlineButton}
                tags={[
                  { name: 'Pho', type: 'dish' },
                  { name: 'delivery', type: 'filter' },
                ]}
              >
                delivery pho 🍜
              </LinkButton>{' '}
              versus planning a{' '}
              <LinkButton
                fontWeight="400"
                tags={[
                  { name: 'Date', type: 'lense' },
                  { name: 'price-high', type: 'filter' },
                ]}
                {...inlineButton}
                backgroundColor={lightGreen}
                hoverStyle={{
                  backgroundColor: `${lightGreen}44`,
                }}
              >
                date night 🌃
              </LinkButton>{' '}
              is <em>unique</em>: one night it's a specific dish and delivery
              speed, the other it's vibe and service. It depends on your mood.
            </Paragraph>

            <Paragraph size="xl" fontStyle="italic">
              Dish gives points to every facet of a restaurant: each dish, the
              ambiance, service, and a lot more.
            </Paragraph>

            <Paragraph size="lg">
              When you search "quick cheap pizza", we take positive and negative
              sentiment from reviews towards "quickness", "cheapness" and
              "pizzaness" as points and add them up. That's how they sort!
            </Paragraph>

            <Paragraph size="lg">
              Then, we let you vote on any aspect. In fact, when you write a
              review on Dish{' '}
              <TextStrong>
                we automatically turn what you say into votes
              </TextStrong>{' '}
              (that you can see and change before submitting). Just speak your
              mind, we do the rest.
            </Paragraph>

            <Paragraph size="xl" fontStyle="italic">
              But what about different tastes?
            </Paragraph>

            <Paragraph size="lg">
              <TextStrong>
                Food search apps today aren't catered to your personal taste
              </TextStrong>
              . We're working on a way to give you control over your taste
              profile, but it will take time. We think we can do it in a way
              that is transparent and under your control, but still easy to do
              and fun. rate.
            </Paragraph>

            <Paragraph size="xl" fontStyle="italic">
              Does it do anything else?
            </Paragraph>

            <Paragraph size="lg">
              Dish searches across every delivery app. We found it tiring to
              have to flip between delivery apps with low quality ratings and
              food search apps constantly.
            </Paragraph>

            <Paragraph size="xl" fontStyle="italic">
              In the long term
            </Paragraph>

            <Paragraph size="lg">
              We want to build the Hitchhiker's Guide to Gastronomy. Something
              more fun. With smart descriptions that highlight what's unique
              based on what people say and vote on for each spot. And a map of
              your favorites and food adventures that you can build over time.
            </Paragraph>

            <Paragraph size="lg">Our goals:</Paragraph>

            <UnorderedList spacing>
              <UnorderedListItem size="lg">
                <TextStrong>
                  Make a better guide and map of the world 🎙
                </TextStrong>{' '}
                - With natural langauge analysis, a taste profile you control,
                discussions, voting, and specialization, we want to prove that
                you turn an active community into a current best of guide.
              </UnorderedListItem>
              <UnorderedListItem size="lg">
                <TextStrong>Enable specialized restaurants ✨</TextStrong>-
                Instead of having to please everyone to try for 5 stars overall,
                restaurants should be rewarded for doing one or two things
                exceptionally well.
              </UnorderedListItem>
            </UnorderedList>

            <Spacer />

            <Paragraph size="xxl">Enjoy! 🌮🍜</Paragraph>

            <Spacer />
            <Divider />
            <Spacer />

            <Paragraph
              backgroundColor={`${lightYellow}99`}
              borderWidth={2}
              borderColor={lightYellow}
              borderRadius={20}
              paddingVertical={10}
              sizeLineHeight={0.8}
              fontStyle="italic"
              size="xxl"
              fontWeight="500"
              textAlign="center"
              color={brandColorDark}
            >
              Dish, your food{' '}
              <Text display="inline" fontWeight="600">
                pokédex
              </Text>
              <br />
              <Text fontWeight="400" display="inline" fontSize={20}>
                a pocket guide to the world
              </Text>
            </Paragraph>

            <Spacer />
            <Divider />
            <Spacer />

            <Paragraph size="xl">
              <AbsoluteVStack
                zIndex={1}
                bottom={34}
                right={15}
                width={125}
                height={125}
                transform={[{ rotate: '12deg' }]}
              >
                <Image
                  style={{ width: '100%', height: '100%' }}
                  source={{ uri: dontPanic }}
                  resizeMode="contain"
                />
              </AbsoluteVStack>
              If this all sounds interesting and you actually read this far,{' '}
              <Link display="inline" href="mailto:team@dishapp.com">
                send us an email to join our team
              </Link>
              . We're looking for people who want to build the real world
              Hitchhiker's Guide to the Galaxy.
            </Paragraph>
            <Spacer size="sm" />
            {/* <form>
              <VStack>
                <Input name="email" type="email" placeholder="Email..." />
                <TextArea name="comment" numberOfLines={100} />
                <Button>Submit</Button>
              </VStack>
            </form> */}
            <Spacer />
            <Spacer />
            <Spacer />
            <Spacer />
          </VStack>
        </VStack>
      </ContentScrollView>
    </StackDrawer>
  )
}
