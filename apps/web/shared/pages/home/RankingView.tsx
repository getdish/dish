import { StackProps, SuperScriptText, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'

export const RankingView = memo(
  ({ rank, ...props }: { rank: number } & StackProps) => {
    return (
      <VStack
        borderRadius={100}
        width={47}
        alignItems="center"
        justifyContent="center"
        marginVertical={-13}
        transform={[{ rotate: '-12deg' }]}
        {...props}
      >
        <Text
          fontSize={rank > 9 ? 16 : 26}
          lineHeight={22}
          letterSpacing={-2}
          fontWeight="700"
          color="#000"
        >
          <SuperScriptText opacity={0.35} letterSpacing={0}>
            #
          </SuperScriptText>
          {rank}
        </Text>
      </VStack>
    )
  }
)
