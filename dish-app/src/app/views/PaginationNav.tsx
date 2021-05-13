import React from 'react'
import { ScrollView } from 'react-native'
import { HStack } from 'snackui'

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
          <HStack>
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
          </HStack>
        </ScrollView>
      )}
    </>
  )
}
