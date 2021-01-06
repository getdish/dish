import React, { useEffect } from 'react'
import { Image } from 'react-native'
import { AbsoluteVStack, Divider, Paragraph, Spacer, VStack } from 'snackui'

import dontPanic from '../../../assets/dont-panic.svg'
import { lightGreen, lightYellow } from '../../../constants/colors'
import { HomeStateItemAbout } from '../../../types/homeTypes'
import { drawerStore } from '../../drawerStore'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Link } from '../../views/Link'
import { LinkButton } from '../../views/LinkButton'
import { LogoColor } from '../../views/Logo'
import { StackDrawer } from '../../views/StackDrawer'
import { TextStrong } from '../../views/TextStrong'
import { StackItemProps } from '../HomeStackView'

const inlineButton = {
  borderRadius: 10,
  paddingHorizontal: 10,
  paddingVertical: 2,
  position: 'relative',
  display: 'inline-flex',
} as const

export default function AboutPage({
  item,
  isActive,
}: StackItemProps<HomeStateItemAbout>) {
  useEffect(() => {
    if (!isActive) return undefined
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
            <Spacer size="xl" />
            <LogoColor scale={2.5} />
            <Spacer size="lg" />
            <Paragraph
              zIndex={10}
              color="#999"
              textAlign="center"
              size={1.1}
              fontWeight="500"
            >
              find amazing things
            </Paragraph>
          </VStack>

          <VStack paddingHorizontal="5%" spacing="xl">
            <Paragraph size="xxl">
              We're building a better map of the world. We want to explore
              cities and neighborhoods down to the unique dishes that make them
              great. We think local search should be{' '}
              <strong>custom to your taste</strong> and understand that what
              matters in a lunchtime bowl of pho is different than a date-night
              steak dinner.
            </Paragraph>

            <Paragraph size="xl">
              It turns out what you care about when ordering{' '}
              <LinkButton
                backgroundColor={lightYellow}
                hoverStyle={{
                  backgroundColor: `${lightYellow}44`,
                }}
                {...inlineButton}
                tags={[
                  { name: 'Pho', type: 'dish' },
                  { name: 'price-low', type: 'filter' },
                ]}
              >
                cheap pho 🍜
              </LinkButton>{' '}
              versus planning a{' '}
              <LinkButton
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
              speed, the next it's the atmosphere and service. Dish breaks
              ratings down exactly across tags. For example 💎 uniqueness, 🥬
              green-friendly, and 🌃 vibes.
            </Paragraph>

            <Paragraph size="lg">
              When you write a review on Dish{' '}
              <TextStrong>
                we automatically turn what you say into votes
              </TextStrong>{' '}
              that you can manually change as you please. Speak your mind, we do
              the rest.
            </Paragraph>

            <Paragraph size="md" fontWeight="600">
              You mentioned delivery?
            </Paragraph>

            <Paragraph size="lg">
              We found it tiring to have to flip between 3 delivery apps with
              low quality ratings and a separate app for higher quality ratings.
              Dish search shows{' '}
              <TextStrong>every delivery service in your results,</TextStrong>{' '}
              so you can start from finding something good and then go order it.
            </Paragraph>

            <Paragraph size="md" fontWeight="600">
              Long term
            </Paragraph>

            <Paragraph size="lg">
              We want to build a mix of a Hitchhiker's Guide to the Galaxy (a
              smarter world guide with personality) and a Pokédex (a pocket map
              curating your favorite things) that is built around lists of fun
              days and nights out that anyone can create and vote on. We think
              the dish model of breaking down ratings by the factors that matter
              unlocks all of this and more.
            </Paragraph>

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
