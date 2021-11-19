import { AbsoluteYStack, Text, YStack, useTheme } from '@dish/ui'
import React, { memo } from 'react'

import { isWeb } from '../../../constants/constants'
import { TextSuperScript } from '../../views/TextSuperScript'

export const RankView = memo(({ rank }: { rank: number }) => {
  const theme = useTheme()
  return (
    <YStack
      width={44}
      height={44}
      {...(isWeb &&
        {
          // transform: [{ translateY: -10 }],
          // marginRight: -15,
        })}
      {...(!isWeb && {
        marginLeft: -6,
        marginTop: -10,
        marginRight: 0,
      })}
      position="relative"
      alignItems="center"
      justifyContent="center"
    >
      <AbsoluteYStack
        borderRadius={1000}
        fullscreen
        // backgroundColor={theme.backgroundColorSecondary}
        zIndex={-1}
      />
      <Text textAlign="center" lineHeight={38}>
        <Text opacity={0.5} color={theme.colorQuartenary} y={-5} x={10} fontSize={11}>
          #
        </Text>
        <Text
          letterSpacing={-1}
          fontSize={+rank > 9 ? 18 : 22}
          fontWeight="500"
          color={theme.colorTertiary}
        >
          {rank}
        </Text>
      </Text>
    </YStack>
  )
})
