import React, { memo } from 'react'
import { Text, VStack, useTheme } from 'snackui'

import { isWeb } from '../../../constants/constants'
import { TextSuperScript } from '../../views/TextSuperScript'

export const RankView = memo(({ rank }: { rank: number }) => {
  const theme = useTheme()
  return (
    <VStack
      width={48}
      height={48}
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
      backgroundColor={theme.backgroundColorAlt}
      borderRadius={1000}
      alignItems="center"
      justifyContent="center"
    >
      <Text transform={[{ translateY: -0 }]} textAlign="center" lineHeight={38}>
        <TextSuperScript color={theme.colorAlt} transform={[{ translateY: -15 }]} fontSize={11}>
          #
        </TextSuperScript>
        <Text
          letterSpacing={-1}
          fontSize={+rank > 9 ? 18 : 24}
          fontWeight="300"
          color={theme.colorAlt}
        >
          {rank}
        </Text>
      </Text>
    </VStack>
  )
})
