import { XStack } from '@dish/ui'
import React from 'react'
import { ScrollView } from 'react-native'

import { SmallButton } from './SmallButton'

export const PaginationNav = ({
  page,
  totalPages,
  setPage,
}: {
  totalPages: number
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
}) => {
  const pageItems = new Array(totalPages).fill(null)
  return (
    <>
      {totalPages > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack>
            {pageItems.map((_, index) => {
              return (
                <SmallButton
                  key={index}
                  theme={index + 1 === page ? 'active' : null}
                  onPress={() => setPage(index + 1)}
                >
                  {index + 1}
                </SmallButton>
              )
            })}
          </XStack>
        </ScrollView>
      )}
    </>
  )
}
