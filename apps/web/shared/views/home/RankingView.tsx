import React, { memo } from 'react'
import { Text } from 'react-native'

import { StackBaseProps, VStack } from '../shared/Stacks'
import { SuperScriptText } from './SuperScriptText'

export const RankingView = memo(
  ({ rank, ...props }: { rank: number } & StackBaseProps) => {
    return (
      <VStack
        borderRadius={100}
        borderColor="rgba(0,0,0,0.05)"
        borderWidth={1}
        width={47}
        height={47}
        alignItems="center"
        justifyContent="center"
        marginLeft={-32}
        marginRight={4}
        marginVertical={-10}
        transform={[{ rotate: '-12deg' }]}
        {...props}
      >
        <Text
          style={{
            fontSize: 26,
            lineHeight: 22,
            letterSpacing: -3,
            fontWeight: '500',
            color: rank == 1 ? 'darkgreen' : 'black',
          }}
        >
          <SuperScriptText style={{ opacity: 0.5, letterSpacing: 0 }}>
            #
          </SuperScriptText>
          {rank}
        </Text>
      </VStack>
    )
  }
)
