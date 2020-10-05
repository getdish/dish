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
              Craving pho? Amazing Vietnamese and other hole in the wall spots
              are often lost to 3.5-star reviews. We think we can fix this by{' '}
              <TextStrong>doing ratings down to the dish</TextStrong>, and other
              factors that matter.
            </Paragraph>

            <Paragraph size="lg">
              It turns out what you care about ordering{' '}
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
              is <em>unique</em>: a specific dish and delivery, or the vibe and
              service.
            </Paragraph>

            <Paragraph size="xxl" fontStyle="italic">
              Dish ranks by points, instead.
            </Paragraph>

            <Paragraph size="lg">
              When you search "delivery cheap pho", we take positive and
              negative sentiment from reviews towards <em>delivery</em>,{' '}
              <em>cheapness</em> and <em>pho</em> as points and add them up. In
              fact, when you write a review on Dish{' '}
              <TextStrong>
                we automatically turn what you say into votes
              </TextStrong>
              . Speak your mind, we do the rest.
            </Paragraph>

            <Paragraph size="xl" fontStyle="italic">
              But what about different tastes?
            </Paragraph>

            <Paragraph size="lg">
              <TextStrong>
                Food search apps today aren't catered to your personal taste
              </TextStrong>
              . We want to expose users with similar tastes and what they
              recommend.
            </Paragraph>

            <Paragraph size="xl" fontStyle="italic">
              What's all this about delivery?
            </Paragraph>

            <Paragraph size="lg">
              Dish searches across every delivery app, so you can start from
              finding something good, and then go order it. We found it tiring
              to have to flip between delivery apps with low quality ratings and
              food search apps constantly.
            </Paragraph>

            <Paragraph size="xl" fontStyle="italic">
              In the long term
            </Paragraph>

            <Paragraph size="lg">
              We want to build a some mix of a real world Hitchhiker's Guide to
              the Galaxy and a Pokédex. A fun, personal app and community for
              exploring the world.
            </Paragraph>

            <Paragraph size="lg">Our goals:</Paragraph>

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
