import React, { useEffect } from 'react'
import { Image } from 'react-native'
import {
  AbsoluteVStack,
  Divider,
  Paragraph,
  Spacer,
  UnorderedList,
  UnorderedListItem,
  VStack,
} from 'snackui'

import dontPanic from '../../../assets/dont-panic.svg'
import { lightGreen, lightYellow } from '../../../constants/colors'
import { HomeStateItemAbout } from '../../../types/homeTypes'
import { drawerStore } from '../../drawerStore'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Link } from '../../views/Link'
import { LinkButton } from '../../views/LinkButton'
import { LogoColor } from '../../views/Logo'
import { StackDrawer } from '../../views/StackDrawer'
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
        drawerStore.setSnapIndex(0)
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
              We want to build a high quality, fun, collaborative guide to the
              real world that maintains high quality, even in the long run.
            </Paragraph>

            <Paragraph size="xl">
              We're starting with food, where we think there are many problems
              with existing sites and apps which initially sparked our interest
              in dish. Too many hole-in-the-wall restaurants get lost to poor
              ratings. What you look for when ordering{' '}
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
                date 🌃
              </LinkButton>{' '}
              are <em>fundamentally different</em> - one night you crave an
              authentic dish, the others you just want some nice ambiance and
              drinks.
            </Paragraph>

            <Paragraph size="lg" fontWeight="600">
              Dish tears down the 5-star world. We rate what matters, exactly -
              a dish, the service, the vibe, and more.
            </Paragraph>

            <Paragraph size="lg">
              We want to prove you can build a high quality app that doesn't
              bend to advertising pressure by focusing on community and quality
              from the start. With a play on sub-reddits and specialization,
              community-powered everything (voting, moderation, and rating), we
              think we can do that.
            </Paragraph>

            <Paragraph size="lg">
              Dish is just getting started. It (kinda) works. It's sketchy, and
              it breaks all the time. Some things are confusing. But we put a
              lot of thought and work into the foundation, so we can move
              quickly from here. Let us know what you'd love to see.
            </Paragraph>

            <Paragraph size="lg">We hope you enjoy 🌮🍜</Paragraph>

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
              Consider{' '}
              <Link display="inline" href="mailto:team@dishapp.com">
                telling us what we should do better
              </Link>
              , or better, send a pic of your favorite taqueria.
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
