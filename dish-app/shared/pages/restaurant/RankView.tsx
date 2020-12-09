import React, { memo } from 'react'
import { Text, TextSuperScript, VStack } from 'snackui'

import { bgLight } from '../../colors'
import { isWeb } from '../../constants'

export const RankView = memo(({ rank }: { rank: number }) => {
  return (
    <VStack
      width={38}
      height={38}
      {...(isWeb && {
        marginLeft: -16,
        marginBottom: -10,
        transform: [{ translateY: -15 }],
        marginRight: -4,
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
      <Text
        color="#777"
        transform={[{ translateY: -0 }]}
        textAlign="center"
        lineHeight={38}
      >
        <TextSuperScript transform={[{ translateY: -4 }]} fontSize={11}>
          #
        </TextSuperScript>
        <Text
          letterSpacing={-1}
          fontSize={+rank > 9 ? 18 : 22}
          fontWeight="500"
          color="#000"
        >
          {rank}
        </Text>
      </Text>
    </VStack>
  )
})
