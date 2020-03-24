import React from 'react'
import { Text } from 'react-native'
import { VStack } from '../shared/Stacks'
import { SuperScriptText } from './TagButton'

export function RankingView({ rank }: { rank: number }) {
  return (
    <VStack
      borderRadius={100}
      borderColor="rgba(0,0,0,0.15)"
      borderWidth={1}
      width={38}
      height={38}
      alignItems="center"
      justifyContent="center"
      marginLeft={-28}
      marginRight={7}
      marginVertical={-5}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
        }}
      >
        <SuperScriptText>#</SuperScriptText>
        {rank}
      </Text>
    </VStack>
  )
}
