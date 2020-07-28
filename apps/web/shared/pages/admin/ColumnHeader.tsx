import { HStack, Spacer, Text } from '@dish/ui'

export const ColumnHeader = ({
  children,
  after,
}: {
  children: any
  after?: any
}) => {
  return (
    <HStack
      minHeight={30}
      maxWidth="100%"
      overflow="hidden"
      borderBottomColor="#ddd"
      borderBottomWidth={1}
      justifyContent="space-between"
      alignItems="center"
    >
      <Text paddingHorizontal={5} fontWeight="600" fontSize={13}>
        {children}
      </Text>
      <Spacer />
      {after}
    </HStack>
  )
}
