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
            marginLeft={-60}
            marginRight={20}
            paddingLeft={60}
            borderRadius={60}
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
            <Image
              source={{ uri: dishNeon }}
              style={{
                width: 261 * 1.5,
                height: 161 * 1.5,
                marginTop: -26,
                marginBottom: -42,
              }}
            />
            <Paragraph
              zIndex={10}
              color="#fff"
              textAlign="center"
              size={1.1}
              fontWeight="600"
            >
              the better restaurant recommender
            </Paragraph>
          </VStack>

          <Spacer size="sm" />

          <VStack paddingHorizontal="5%" spacing="xl">
            <Paragraph size="xxl">
              Restaurant search is broken in three ways:
            </Paragraph>

            <UnorderedList spacing="xs">
              <UnorderedListItem size="xl">
                Recommendations aren't catered to your personal taste.
              </UnorderedListItem>
              <UnorderedListItem size="xl">
                Hole-in-the-wall restaurants are lost to 3.5 star ratings.
              </UnorderedListItem>
              <UnorderedListItem size="xl">
                There are 5 delivery apps, each with sketchy ratings.
              </UnorderedListItem>
            </UnorderedList>

            <Paragraph size="xl">
              But also — <TextStrong>where's all the fun</TextStrong>? When
              FourSquare shut down, the closest thing we had to a fun map of the
              world was lost. We want to build a modern Hitchhiker's Guide to
              Gastronomy: a community that thinks different and explores and
              curates a guide to the unique gems in every part of the world.
            </Paragraph>

            <Spacer size={0} />

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

            <Spacer size={0} />

            <Paragraph size="lg">
              So, we're building something that solves our frustrations. Here's
              how we're thinking about it.
            </Paragraph>

            <Paragraph size="xl" fontWeight="500">
              Searching delivery? Not too hard ✅
            </Paragraph>

            <Paragraph size="lg">
              We crawled every delivery app and made them all searchable in one
              simple interface.
            </Paragraph>

            <Paragraph size="xl" fontWeight="500">
              To your taste? We have ideas 💡
            </Paragraph>

            <Paragraph size="lg">
              We want to highlight chefs and people in each local community and
              let you follow the ones you agree with. We don't think data mining
              works well enough, and where's the fun in that? Instead, you
              curate your own map of the world through votes and follows.
            </Paragraph>

            <Paragraph size="xl" fontWeight="500">
              But how to fix hole-in-the-wall ratings?
            </Paragraph>

            <Paragraph size="lg">
              Our answer:{' '}
              <TextStrong>
                a single 5 star rating may not be what we need
              </TextStrong>
              . The reason hole-in-the-wall restaurants get lost is because
              often they don't cater to service or ambiance. We realized, what
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
              is <em>unique</em>: maybe one night it's a specific dish and the
              delivery speed, and another night it's the vibe and service. Maybe
              you do care about it all sometimes. It totally depends on your
              mood.
            </Paragraph>

            <Paragraph size="lg" fontStyle="italic">
              So, we're throwing away the stars (sort of).
            </Paragraph>

            <Paragraph size="lg">
              When you search "quick cheap pizza", we take positive and negative
              sentiment from all reviews specifically towards "quickness",
              "cheapness" and "pizza(ness)". We turn those into points and add
              them up. Every search is ranked by points, and highly tuned to
              what you look for - all the way down to individual dishes. More
              than that, the points are visible to you, and you can vote on
              them.
            </Paragraph>

            <Paragraph size="lg">
              If you love the tacos at a restaurant - vote up their tacos. In
              fact, when you write a review on Dish{' '}
              <TextStrong>
                we automatically turn what you say into votes
              </TextStrong>{' '}
              (that you can see and change before submitting). Just speak your
              mind, we do the rest.
            </Paragraph>

            <Paragraph size="lg">
              Finally, Dish sources reviews from every top food review site.
              Think of it like RottenTomatoes, for, well, real tomatoes. We want
              to build something fun, personal and fast. A guide that caters to
              you. Collect, discover and curate local gems, see friends and
              chefs picks, get tips on where to go and what to order there, and
              filter by mood and desire.
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

            <Paragraph size="xxl">Enjoy! 🌮🍜</Paragraph>

            <Spacer />
            <Divider />
            <Spacer />

            <Paragraph size="xl">
              If this all sounds interesting and you actually read this far,{' '}
              <Link display="inline" href="mailto:team@dishapp.com">
                send us an email to join our team
              </Link>
              . We're looking for people who want to build the real world
              Hitchhiker's Guide to the <TextStrong>Galaxy</TextStrong>.
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
