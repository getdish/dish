import {
  BorderTop,
  Button,
  Icon,
  Image,
  Space,
  Stack,
  View,
  memoIsEqualDeep,
  useTheme,
} from '@o/ui'
import React, { memo } from 'react'

import { linkProps } from '../../useLink'
import { FadeInView, fadeAnimations, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { BodyButton } from './BodyButton'
import { blackWavePattern, purpleWave, purpleWaveUrl } from './purpleWaveUrl'
import { SpacedPageContent } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

const apps = [
  {
    icon: <Icon name="moon" />,
    title: 'Jira',
    description: 'Data App: Read and write to Jira with a fully typed API.',
    downloads: '12,140',
    hearts: '52',
  },
  {
    icon: <Icon name="moon" />,
    title: 'Drive',
    description: 'Data App: Read and write to Drive with a fully typed API.',
    downloads: '4,821',
    hearts: '23',
  },
  {
    icon: <Icon name="moon" />,
    title: 'Slack',
    description: 'Data App: Read and write to Slack with a fully typed API.',
    downloads: '7,123',
    hearts: '47',
  },
  {
    icon: <Icon name="moon" />,
    title: 'Github',
    description: 'Data App: Read and write to Github with a fully typed API.',
    downloads: '4,489',
    hearts: '154',
  },
  {
    icon: <Icon name="moon" />,
    title: 'Gmail',
    description: 'Data App: Read and write to Gmail with a fully typed API.',
    downloads: '3,123',
    hearts: '20',
  },
  {
    icon: <Icon name="moon" />,
    title: 'Sheets',
    description: 'Data App: Read and write to Sheets with a fully typed API.',
    downloads: '891',
    hearts: '7',
  },
  {
    icon: <Icon name="moon" />,
    title: 'Postgres',
    description: 'Data App: Read and write to Postgres with a fully typed API.',
    downloads: '2,421',
    hearts: '44',
  },
  {
    icon: <Icon name="moon" />,
    title: 'GDocs',
    description: 'Data App: Read and write to GDocs with a fully typed API.',
    downloads: '4,213',
    hearts: '12',
  },
  {
    icon: <Icon name="moon" />,
    title: 'Confluence',
    description:
      'Data App: Read and write to Confluence with a fully typed API.',
    downloads: '923',
    hearts: '7',
  },
]

export default memo(() => {
  const FadeDataApps = useFadePage({ threshold: 0 })
  return (
    <FadeDataApps.FadeProvide>
      {/* deep purple right */}
      <Page.BackgroundParallax
        offset={-0.3}
        speed={0.45}
        zIndex={-2}
        opacity={0.45}
        x="10%"
        scale={2.5}
        background="radial-gradient(circle closest-side, #7523AD, transparent)"
      />

      <Page.BackgroundParallax
        speed={0.01}
        zIndex={-10}
        offset={-0.2}
        backgroundSize="cover"
        left="-40%"
        width="180%"
        height="280%"
        top="-120%"
        backgroundPosition="top center"
        opacity={0.4}
        backgroundImage={blackWavePattern}
      />

      <SpacedPageContent
        nodeRef={FadeDataApps.ref}
        height="auto"
        maxHeight={100000}
        margin={0}
        // extra on top for the orbits
        padding={['14vh', 0, '8vh']}
        xs-margin={0}
        header={
          <Stack space="lg">
            <FadeInView parallax delayIndex={0}>
              <PillButton>Community</PillButton>
            </FadeInView>
            <Stack space="md">
              <FadeInView parallax delayIndex={1}>
                <TitleText textAlign="center" size="xl">
                  Communities that curate favorites
                </TitleText>
              </FadeInView>
              <FadeInView parallax delayIndex={2}>
                <TitleTextSub>
                  Sync data, expose GraphQL and TypeScript APIs, and
                  render&nbsp;content. The&nbsp;app&nbsp;store&nbsp;enables
                  cooperative app-building.
                </TitleTextSub>
              </FadeInView>
            </Stack>
            <Space size="xl" />
          </Stack>
        }
      >
        <Stack
          direction="horizontal"
          className="hide-scrollbars"
          height="auto"
          space="md"
          padding={[60, false]}
          spaceAround
          justifyContent="center"
          pointerEvents="none"
          transform={{
            y: -120,
          }}
        >
          {apps.map((app, index) => {
            let pivot = Math.round(apps.length / 2) - 1
            let offset = index * 30
            if (index >= pivot) {
              let i = index - pivot
              offset = pivot * 30 - i * 30
            }
            return (
              <Integration
                key={app.title}
                index={index}
                {...app}
                transform={{ y: `${offset}px` }}
              />
            )
          })}
        </Stack>

        <FadeInView parallax delayIndex={3} {...fadeAnimations.up}>
          <Stack direction="horizontal" space margin={[0, 'auto']}>
            <BodyButton {...linkProps('/apps')} size="lg">
              Explore
            </BodyButton>
          </Stack>
        </FadeInView>
      </SpacedPageContent>
    </FadeDataApps.FadeProvide>
  )
})

const Integration = memoIsEqualDeep(
  ({ icon, title, index, downloads, hearts, ...props }: any) => {
    const theme = useTheme()
    const borderColor = theme.borderColor.setAlpha(0.1)
    return (
      <FadeInView
        parallax
        {...(index % 1 == 0 ? fadeAnimations.up : fadeAnimations.down)}
        delay={index * 100 + 250}
      >
        <View
          animate={{
            y: -10,
          }}
          transition={{ yoyo: Infinity, duration: 2, repeatDelay: index * 1 }}
        >
          <View
            userSelect="none"
            height={140}
            width={130}
            borderRadius={10}
            border={[1, borderColor]}
            {...props}
          >
            <Stack padding space alignItems="center" justifyContent="center">
              {icon}
              <Paragraph selectable={false} size="sm">
                {title}
              </Paragraph>
            </Stack>
            <Stack
              direction="horizontal"
              opacity={0.5}
              position="relative"
              alignItems="center"
              justifyContent="space-between"
            >
              <BorderTop borderColor={borderColor} />
              <Button chromeless size={0.9} icon="download">
                {downloads}
              </Button>
              <Button chromeless size={0.9} icon="heart" iconAfter>
                {hearts}
              </Button>
            </Stack>
          </View>
        </View>
      </FadeInView>
    )
  }
)
