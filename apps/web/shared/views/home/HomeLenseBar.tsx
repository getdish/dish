import { Box, Text } from '@dish/ui'
import { HoverablePopover } from '@dish/ui'
import { LinearGradient } from '@dish/ui'
import { HStack, VStack, ZStack } from '@dish/ui'
import React, { memo } from 'react'
import { ChevronRight } from 'react-feather'
import { StyleSheet } from 'react-native'

import {
  HomeActiveTagIds,
  HomeStateItemHome,
  HomeStateItemSearch,
} from '../../state/home'
import { getTagId } from '../../state/Tag'
import { useOvermind } from '../../state/useOvermind'
import HomeFilterBar from './HomeFilterBar'
import { LenseButton, LenseButtonSize } from './LenseButton'

export default memo(function HomeLenseBar(props: {
  state: HomeStateItemSearch | HomeStateItemHome
  hideLenses?: boolean
  relative?: boolean
  spacer?: any
}) {
  const activeTagIds = props.state.activeTagIds
  const content = (
    <>
      {!props.hideLenses && <HomeLenseBarOnly activeTagIds={activeTagIds} />}
      {props.spacer}
      <HomeFilterBar activeTagIds={activeTagIds} />
    </>
  )
  if (props.relative) {
    return content
  }
  return <HomeContentTopBar>{content}</HomeContentTopBar>
})

const transparentWhite = 'rgba(255,255,255,0)'

export function HomeContentTopBar(props: { children: any }) {
  return (
    <ZStack zIndex={10} right={0} left={0} pointerEvents="none">
      <VStack pointerEvents="auto" spacing="sm">
        {props.children}
      </VStack>
      {/* <LinearGradient
        colors={[
          'rgba(255,255,255,0.4)',
          '#fff',
          '#fff',
          transparentWhite,
          transparentWhite,
          transparentWhite,
          transparentWhite,
          transparentWhite,
          transparentWhite,
          transparentWhite,
        ]}
        style={[
          StyleSheet.absoluteFill,
          { zIndex: -1, marginBottom: -80, marginTop: -30 },
        ]}
      /> */}
    </ZStack>
  )
}

export const HomeLenseBarOnly = memo(
  (props: { activeTagIds: HomeActiveTagIds; size?: LenseButtonSize }) => {
    const om = useOvermind()
    return (
      <HStack
        borderRadius={100}
        padding={6}
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        {om.state.home.allLenseTags.map((lense, index) => (
          <LenseButton
            key={lense.id + index}
            lense={lense}
            isActive={props.activeTagIds[getTagId(lense)]}
            minimal={index > -1}
            size={props.size}
          />
        ))}
      </HStack>
    )
  }
)
