import { isWeb } from '../../../constants/constants'
import { AbsoluteYStack, Text, YStack } from '@dish/ui'
import React, { memo } from 'react'

export const RankView = memo(({ rank }: { rank: number }) => {
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
      <AbsoluteYStack borderRadius={1000} fullscreen zIndex={-1} />
      <Text textAlign="center" lineHeight={38}>
        <Text opacity={0.5} color="$colorFocus" y={-5} x={10} fontSize={11}>
          #
        </Text>
        <Text
          letterSpacing={-1}
          fontSize={+rank > 9 ? 18 : 22}
          fontWeight="500"
          color="$colorPress"
        >
          {`${rank}`}
        </Text>
      </Text>
    </YStack>
  )
})
