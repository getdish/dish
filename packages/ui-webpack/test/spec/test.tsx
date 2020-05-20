import { VStack } from '@dish/ui'
import { Text } from 'react-native'

export function Test() {
  return (
    <VStack flex={1} borderRadius={100} backgroundColor="red">
      <Text>Hello world</Text>
    </VStack>
  )
}
