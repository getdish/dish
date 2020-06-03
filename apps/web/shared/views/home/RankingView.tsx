import { StackProps, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'

import { SuperScriptText } from './SuperScriptText'

export const RankingView = memo(
  ({ rank, ...props }: { rank: number } & StackProps) => {
    return (
      <VStack
        borderRadius={100}
        // borderColor="rgba(0,0,0,0.05)"
        // borderWidth={1}
        width={47}
        // height={47}
        alignItems="center"
        justifyContent="center"
        marginVertical={-13}
        transform={[{ rotate: '-12deg' }]}
        {...props}
      >
        <Text
          fontSize={rank > 9 ? 20 : 25}
          lineHeight={22}
          letterSpacing={-2}
          fontWeight="400"
          color="#555"
        >
          <SuperScriptText style={{ opacity: 0.35, letterSpacing: 0 }}>
            #
          </SuperScriptText>
          {rank}
        </Text>
      </VStack>
    )
  }
)
