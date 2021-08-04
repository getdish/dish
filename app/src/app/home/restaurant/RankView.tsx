import React, { memo } from 'react'
import { AbsoluteVStack, Text, VStack, useTheme } from 'snackui'

import { isWeb } from '../../../constants/constants'
import { TextSuperScript } from '../../views/TextSuperScript'

export const RankView = memo(({ rank }: { rank: number }) => {
  const theme = useTheme()
  return (
    <VStack
      width={44}
      height={44}
      {...(isWeb && {
        transform: [{ translateY: -10 }],
        marginRight: -15,
      })}
      {...(!isWeb && {
        marginLeft: -6,
        marginTop: -10,
        marginRight: 0,
      })}
      position="relative"
      alignItems="center"
      justifyContent="center"
      opacity={0.7}
    >
      <AbsoluteVStack
        borderRadius={1000}
        fullscreen
        backgroundColor={theme.backgroundColorAlt}
        opacity={0.35}
        zIndex={-1}
      />
      <Text textAlign="center" lineHeight={38}>
        <TextSuperScript color={theme.colorAlt} transform={[{ translateY: -15 }]} fontSize={11}>
          #
        </TextSuperScript>
        <Text
          letterSpacing={-1}
          fontSize={+rank > 9 ? 17 : 21}
          fontWeight="500"
          color={theme.color}
        >
          {rank}
        </Text>
      </Text>
    </VStack>
  )
})
