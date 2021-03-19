import { Grid, Image, ParallaxView, Space, Stack, View } from '@o/ui'
import { flatMap } from 'lodash'
import React, { memo, useRef, useState } from 'react'

import { LogoCircle, LogoColor } from '../../views/DishLogo'
import { useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { ParallaxStageItem } from '../../views/ParallaxStage'
import { PillButtonDark } from '../../views/PillButtonDark'
import { TitleText } from '../../views/TitleText'
import { IntroPara } from './IntroPara'
import { Item } from './Item'
import { SectionIcon, SectionP, SimpleSection } from './SimpleSection'

export default memo(function FeaturesSection() {
  const Fade = useFadePage()
  const [activeSection, setActiveSection] = useState(sectionNames[0])
  const gridContainer = useRef(null)
  const btnProps = (section: string) => {
    return {
      cursor: 'pointer',
      letterSpacing: 3,
      onClick: () => {
        setActiveSection(section)
      },
      borderWidth: 1,
      background: 'transparent',
      ...(activeSection !== section && {}),
      ...(activeSection === section && {
        background: '#11124A',
        borderColor: '#fff',
      }),
    } as const
  }
  const cur = Object.keys(sections).indexOf(activeSection)
  return (
    <Fade.FadeProvide>
      {/* teal right */}
      <Page.BackgroundParallax
        speed={0.3}
        offset={0.5}
        x="90%"
        top="20%"
        scale={2}
        className="glow-two"
        opacity={0.26}
        background="radial-gradient(circle closest-side, #12A1CC, transparent)"
        parallax={(geometry) => ({
          y: geometry.useParallax(),
          x: geometry.useParallax().transform((x) => -x * 1 + 240),
        })}
      />

      <Page.BackgroundParallax speed={0.4} offset={0.5}>
        <View
          width={1200}
          height={1200}
          borderRadius={1000}
          borderWidth={1}
          borderColor="rgba(255,255,255,0.3)"
        />
      </Page.BackgroundParallax>

      <Stack
        direction="horizontal"
        alignItems="center"
        nodeRef={Fade.ref}
        margin={[0, 'auto']}
        padding={['6vh', 0, '6vh', 0]}
        maxWidth="100vw"
      >
        <Stack padding="lg" flex={2}>
          <View flex={1}>
            <ParallaxStageItem stagger={0}>
              <TitleText fontWeight={300} size="sm" alpha={0.5}>
                Why use a coin?
              </TitleText>
              <Space size={10} />
              <TitleText size="xxxl">It's a better deal.</TitleText>
              <Space size={14} />
              <IntroPara
                delayIndex={1}
                stagger={0}
                size={1.7}
                sizeLineHeight={1.2}
              >
                <strong style={{ color: '#e61277' }}>
                  Earn for your contributions
                </strong>
              </IntroPara>
            </ParallaxStageItem>
            <Space size={10} />
            <ParallaxStageItem stagger={1}>
              <Stack
                direction="horizontal"
                space="lg"
                margin={['4%', 'auto', '8%', 0]}
              >
                {sectionNames.map((section) => (
                  <PillButtonDark key={section} {...btnProps(section)}>
                    {section}
                  </PillButtonDark>
                ))}
              </Stack>
            </ParallaxStageItem>
          </View>
          <ParallaxStageItem
            parallax={{
              x: {
                transition: 'ease-in-quad',
                move: 100,
                clamp: [-100, 100],
              },
              opacity: {
                transition: 'ease-in',
                clamp: [0, 1],
              },
            }}
            stagger={2}
            nodeRef={gridContainer}
          >
            <Stack direction="horizontal" flexWrap="nowrap">
              {Object.keys(sections).map((section, index) => {
                return (
                  <Stack
                    animate={{
                      opacity: cur === index ? 1 : 0,
                      x:
                        cur === index
                          ? '0%'
                          : cur > index
                          ? `-${(cur - index) * 20}%`
                          : `${(index - cur) * 20}%`,
                    }}
                    pointerEvents={cur === index ? 'auto' : 'none'}
                    transition={transition}
                    key={section}
                    space={20}
                    width="100%"
                    alignItems="start"
                    marginRight="-100%"
                  >
                    {sections[section].items.map(
                      ({ title, icon, body }, index) => (
                        <Item
                          key={`${section}${index}`}
                          delay={dly * (index + 1)}
                          title={title}
                        >
                          <SectionP>
                            {/* <SectionIcon name={icon} /> */}
                            {flatMap(body, (x, i) => {
                              return (
                                <React.Fragment key={i}>
                                  {+i === body.length - 1 ? (
                                    x
                                  ) : (
                                    <>
                                      {x}
                                      <Space />
                                    </>
                                  )}
                                </React.Fragment>
                              )
                            })}
                          </SectionP>
                        </Item>
                      )
                    )}
                  </Stack>
                )
              })}
            </Stack>
          </ParallaxStageItem>
        </Stack>

        <View flex={0.15} />

        <View
          sm-display="none"
          position="relative"
          transform={{ x: -40 }}
          flex={1.25}
          height={500}
        >
          <ParallaxStageItem
            stagger={2}
            parallax={{
              x: {
                transition: 'ease-in-quad',
                move: -150,
                clamp: [-150, 400],
              },
              rotateY: {
                transition: 'ease-in-quad',
                move: -100,
                clamp: [-200, 600],
              },
              opacity: {
                transition: 'ease-in',
                clamp: [0, 2],
              },
            }}
          >
            <LogoColor scale={12} />
          </ParallaxStageItem>
        </View>
      </Stack>
    </Fade.FadeProvide>
  )
})

const dly = 200

const sections = {
  Community: {
    // image: require('../../public/images/screen-graphql.jpg'),
    items: [
      {
        icon: `satellite`,
        body: [`Earn tokens for your contributions.`],
      },
      {
        icon: `refresh`,
        body: [`Reputation designed to prevent fraud transparently.`],
      },
      {
        icon: `grid-view`,
        body: [`Data mobility, community-led governance, built-in appeals.`],
      },
    ],
  },
  Curators: {
    // image: require('../../public/images/screen-people.jpg'),
    items: [
      {
        icon: 'button',
        body: [`Earn tokens for moderation and curation.`],
      },
      {
        icon: `exchange`,
        body: [`Vote on and guide sub-communities.`],
      },
      {
        icon: `shop`,
        body: [
          `Invite chains and strong ID verification make moderation easier.`,
        ],
      },
    ],
  },
  Founders: {
    // image: require('../../public/images/screen-graphql.jpg'),
    items: [
      {
        icon: `data`,
        body: [`Less pressure to grow fast = higher quality apps.`],
      },
      {
        icon: 'code-block',
        body: [`Built-in rewards system removes pressures to sell-out.`],
      },
      {
        icon: `satellite`,
        body: [`Pitch to customers directly, share growth with contributors.`],
      },
    ],
  },
}

const sectionNames = Object.keys(sections)

const transition = {
  type: 'spring',
  damping: 20,
  stiffness: 200,
}
