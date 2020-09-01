import { StackProps, SuperScriptText, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'

export const RankingView = memo(
  ({ rank, ...props }: { rank: number } & StackProps) => {
    return (
      <VStack
        paddingHorizontal={5}
        alignItems="center"
        justifyContent="center"
        marginVertical={-13}
        transform={[{ rotate: '-12deg' }]}
        borderRadius={100}
        borderWidth={1}
        borderColor="#eee"
        width={40}
        height={40}
        {...props}
      >
        <Text
          fontSize={rank > 9 ? 18 : 33}
          lineHeight={22}
          letterSpacing={-2}
          fontWeight="300"
          color="rgba(0,0,0,1)"
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
