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
            <Paragraph size="xxl">We have a three step plan:</Paragraph>

            <UnorderedList>
              <UnorderedListItem size="xl">
                Fix restaurant ratings.
              </UnorderedListItem>
              <UnorderedListItem size="xl">
                Make the IRL Hitchhiker's Guide to the Galaxy.
              </UnorderedListItem>
              <UnorderedListItem size="xl">
                Stick it to the man.
              </UnorderedListItem>
            </UnorderedList>

            <Paragraph size="xl">
              We originally wrote a bunch of high-minded words about how
              ordering{' '}
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
              require different <em>lenses</em>, and about how some nights you
              crave an authentic dish, others you want ambiance, and sometimes
              you just want to know if it's not busy (and so on).
            </Paragraph>

            <Paragraph size="lg" fontWeight="600">
              But really, we just want to find places near us with a little
              Pokedex type app that feels fun and has great recs.
            </Paragraph>

            <Paragraph size="lg">
              Dish (kinda) works. It's sketchy. It breaks all the time. Things
              are confusing. But we put a lot of thought into the foundation.
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
