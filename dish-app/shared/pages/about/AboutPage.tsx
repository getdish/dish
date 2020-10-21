import { useStore } from '@dish/use-store'
import React, { useEffect } from 'react'
import { Image } from 'react-native'
import {
  AbsoluteVStack,
  Divider,
  Paragraph,
  Spacer,
  Text,
  UnorderedList,
  UnorderedListItem,
  VStack,
} from 'snackui'

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
      <ContentScrollView id="about">
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
                marginTop: -30,
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

          <VStack paddingHorizontal="5%" spacing="xl">
            <Paragraph size="xxl">
              Craving pho? Amazing Vietnamese and other hole-in-the-wall spots
              are often lost to 3.5-star reviews. We think we can fix this by{' '}
              <TextStrong>doing ratings down to the dish</TextStrong> and the
              other factors that matter.
            </Paragraph>

            <Paragraph size="xl">
              It turns out what you care about when ordering{' '}
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
              is <em>unique</em>: one night it's an authentic dish and delivery
              speed, the next it's the atmosphere and service.
            </Paragraph>

            <Paragraph size="xxl" fontStyle="italic">
              Dish rates specific things, like the dish you're craving.
            </Paragraph>

            <Paragraph size="lg">
              When you search "pho delivery cheap", we look at positive and
              negative sentiment from reviews towards <em>pho</em>,{' '}
              <em>delivery</em> and <em>cheap</em>, then add it up as points and
              show you the best within that narrow selection. We support all
              sorts of interesting tags, here's a few:
            </Paragraph>

            <UnorderedList>
              <UnorderedListItem size="lg">
                💎 Authenticity, Uniqueness
              </UnorderedListItem>
              <UnorderedListItem size="lg">
                🥬 Vegetarian, Vegan
              </UnorderedListItem>
              <UnorderedListItem size="lg">
                🍷 Open Bar, Unique Drinks
              </UnorderedListItem>
              <UnorderedListItem size="lg">
                🌃 Nice to meet, Ambiance
              </UnorderedListItem>
              <UnorderedListItem size="lg">
                🇮🇹 🇹🇭 🇪🇹 Authenticity within every cuisine.
              </UnorderedListItem>
              <UnorderedListItem size="lg">
                🥟 Dim Sum and thousands of other dish categories.
              </UnorderedListItem>
            </UnorderedList>

            <Paragraph size="lg">
              In fact, when you write a review on Dish{' '}
              <TextStrong>
                we automatically turn what you say into votes
              </TextStrong>{' '}
              that you can manually change as you please. Speak your mind, we do
              the rest.
            </Paragraph>

            <Paragraph size="xl" fontStyle="italic">
              What about different tastes?
            </Paragraph>

            <Paragraph size="lg">
              <TextStrong>
                Food search apps today aren't tuned to taste.
              </TextStrong>{' '}
              We're building a way to match you to chefs and experts in every
              cuisine in each city who share your taste so no matter where you
              visit, you have reliable picks from someone who you can see if you
              agree with. No opaque algorithms!
            </Paragraph>

            <Paragraph size="xl" fontStyle="italic">
              You mentioned delivery?
            </Paragraph>

            <Paragraph size="lg">
              We found it tiring to have to flip between 3 delivery apps with
              low quality ratings and a separate app for higher quality ratings.
              Dish search shows{' '}
              <TextStrong>every delivery service in your results,</TextStrong>{' '}
              so you can start from finding something good and then go order it.
            </Paragraph>

            <Paragraph size="xl" fontStyle="italic">
              Our goals
            </Paragraph>

            <Paragraph size="lg">
              We want to build a mix of a Hitchhiker's Guide to the Galaxy (a
              smarter world guide with personality) and a Pokédex (a pocket map
              curating your favorite things) that encourages our world to have
              more uniquely good and focused things to do.
            </Paragraph>

            <UnorderedList spacing>
              <UnorderedListItem size="lg">
                <TextStrong>Design a new type of guide 🎙</TextStrong> - With
                natural langauge analysis, a taste profile you control,
                discussions, voting, and specialization, we want to prove that
                you turn an active community into a current best of guide.
              </UnorderedListItem>
              <UnorderedListItem size="lg">
                <TextStrong>Enable restaurant specialization ✨</TextStrong>-
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
              If this all sounds interesting and you actually read this far,
              consider{' '}
              <Link display="inline" href="mailto:team@dishapp.com">
                sending us an email to join our team
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
