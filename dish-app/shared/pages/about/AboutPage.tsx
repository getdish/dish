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
import dishNeon from '../../assets/dish-neon.jpg'
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
            marginHorizontal={15}
            borderRadius={20}
            paddingBottom={20}
            backgroundColor="#000"
            shadowColor="#000"
            shadowOpacity={0.1}
            shadowRadius={10}
            shadowOffset={{ height: 10, width: 0 }}
            maxWidth="100%"
            alignItems="center"
            position="relative"
          >
            <AbsoluteVStack
              zIndex={1}
              bottom={-34}
              right={-35}
              width={150}
              height={150}
              transform={[{ rotate: '12deg' }]}
            >
              <Image
                style={{ width: '100%', height: '100%' }}
                source={{ uri: dontPanic }}
                resizeMode="contain"
              />
            </AbsoluteVStack>
            <Image
              source={{ uri: dishNeon }}
              style={{
                width: 261 * 1.5,
                height: 161 * 1.5,
                marginTop: -26,
                marginBottom: -44,
              }}
            />
            <Paragraph
              zIndex={10}
              color="#fff"
              textAlign="center"
              size={1.25}
              fontWeight="300"
            >
              More fun exploring the world
            </Paragraph>
          </VStack>

          <VStack paddingHorizontal={15} spacing="xl">
            <Paragraph
              backgroundColor={bgLight}
              borderRadius={20}
              paddingVertical={10}
              fontStyle="italic"
              size="xxl"
              fontWeight="300"
              textAlign="center"
              color={brandColorDark}
            >
              A food app like a{' '}
              <Text display="inline" fontWeight="600">
                Pokédex
              </Text>
              :<br /> fun, personal, stats that matter.
            </Paragraph>

            <Paragraph size="xl">
              We're building a modern{' '}
              <TextStrong>Hitchhikers guide to gastronomy</TextStrong>, if you
              will. A guide and community for great food around the world. Dish
              was born from two frustrations:
            </Paragraph>

            <UnorderedList spacing="xs">
              <UnorderedListItem size="lg">
                Amazing hole-in-the-wall international spots lost to 3.5 star
                ratings.
              </UnorderedListItem>
              <UnorderedListItem size="lg">
                Needing one app to <em>find</em> what's good & others to see if
                it delivers.
              </UnorderedListItem>
            </UnorderedList>

            <Paragraph size="lg">
              Search across delivery? Not too hard. ✅
            </Paragraph>

            <Paragraph size="lg">
              But how do you fix hole-in-the-wall ratings?
            </Paragraph>

            <Paragraph size="lg">
              Our answer:{' '}
              <TextStrong>
                a single 5 star rating is not what we need
              </TextStrong>
              . It reduces everything you care about too much. What you want
              when ordering{' '}
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
              are <em>unique</em>: a specific dish, delivery speed, vibe,
              ambiance - it totally depends on your mood.
            </Paragraph>

            <Paragraph size="lg">So, we're throwing away the stars.</Paragraph>

            <Paragraph size="lg">
              Dish sorts it's results by points. When you search "quick cheap
              pizza", we take positive and negative sentiment from all reviews
              on "quick", "cheap" and "pizza", and add them together.
            </Paragraph>

            <Paragraph size="lg">
              Then, you can upvote and downvote on each. When you write a
              review, we turn your words into votes (that you can fix before
              submitting).{' '}
              <TextStrong>
                Just speak your mind - we turn what you say into votes
              </TextStrong>
              .
            </Paragraph>

            <Paragraph size="lg">
              Dish also sources reviews from top food review sites. It's like
              RottenTomatoes, but for food. We also crawl{' '}
              <Text
                lineHeight={24}
                borderBottomColor="#eee"
                borderBottomWidth={2}
                display="inline"
              >
                every delivery service
              </Text>
              .
            </Paragraph>

            <Paragraph size="lg">
              We want to build something fun and personal. A guide that caters
              to you. Collect, discover and curate local gems, see friend and
              chef picks, get tips on where to go and what to order, and filter
              by mood and desire. Our goal:
            </Paragraph>

            <UnorderedList spacing>
              <UnorderedListItem size="lg">
                <TextStrong>Design a better guide 🎙</TextStrong> - With natural
                langauge analysis, threaded discussions, voting, and
                specialization, we want to prove that you "map-reduce" an active
                community into a "current best of" guide.
              </UnorderedListItem>
              <UnorderedListItem size="lg">
                <TextStrong>Enable specialized restaurants ✨</TextStrong>-
                Instead of having to please everyone to try for 5 stars overall,
                restaurants should be rewarded for doing one or two things
                exceptionally well.
              </UnorderedListItem>
            </UnorderedList>

            <Paragraph size="xxl">Enjoy! 🌮🍜</Paragraph>

            <Spacer />
            <Divider />

            <Paragraph>
              <Link href="mailto:team@dishapp.com">
                Let us know how you'd like to see us grow.
              </Link>
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
