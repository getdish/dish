import React, { Suspense } from 'react'
import { TextInput } from 'react-native'
import { HStack, LoadingItems, VStack } from 'snackui'

import { ColumnHeader } from './ColumnHeader'
import { styles } from './styles'

export const AdminSearchableColumn = ({
  title,
  children,
  onChangeSearch,
}: {
  title: string
  children: any
  onChangeSearch?: (text: string) => void
}) => {
  return (
    <VStack flex={1} maxHeight="100%">
      <ColumnHeader
        after={
          <HStack
            flex={1}
            spacing={10}
            alignItems="center"
            justifyContent="space-between"
          >
            <TextInput
              placeholder="Search..."
              style={[styles.textInput, { flex: 1 }]}
              onChangeText={onChangeSearch}
            />
          </HStack>
        }
      >
        {title}
      </ColumnHeader>
      <Suspense fallback={<LoadingItems />}>{children}</Suspense>
    </VStack>
  )
}
