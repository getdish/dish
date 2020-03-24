import React from 'react'
import { Text } from 'react-native'
import { VStack } from '../shared/Stacks'
import { SuperScriptText } from './TagButton'

export function RankingView({ rank }: { rank: number }) {
  return (
    <VStack
      borderRadius={100}
      borderColor="rgba(0,0,0,0.05)"
      borderWidth={1}
      width={42}
      height={42}
      alignItems="center"
      justifyContent="center"
      marginLeft={-25}
      marginRight={7}
      marginVertical={-6}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
        }}
      >
        <SuperScriptText style={{ opacity: 0.5 }}>#</SuperScriptText>
        {rank}
      </Text>
    </VStack>
  )
}
