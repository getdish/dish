import React, { memo } from 'react'
import { Text, TextSuperScript, VStack } from 'snackui'

import { bgLight, blue, darkBlue, lightBlue } from '../../colors'
import { isWeb } from '../../constants'

export const RankView = memo(({ rank }: { rank: number }) => {
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
      backgroundColor={bgLight}
      borderRadius={1000}
      alignItems="center"
      justifyContent="center"
    >
      <Text transform={[{ translateY: -0 }]} textAlign="center" lineHeight={38}>
        <TextSuperScript
          color={blue}
          transform={[{ translateY: -10 }]}
          fontSize={11}
        >
          #
        </TextSuperScript>
        <Text
          letterSpacing={-1}
          fontSize={+rank > 9 ? 18 : 24}
          fontWeight="800"
          color={blue}
        >
          {rank}
        </Text>
      </Text>
    </VStack>
  )
})
