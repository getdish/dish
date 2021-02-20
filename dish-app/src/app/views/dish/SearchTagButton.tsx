import { Search } from '@dish/react-feather'
import React from 'react'
import { VStack } from 'snackui'

import { NavigableTag } from '../../../types/tagTypes'
import { Link } from '../Link'

export const SearchTagButton = ({
  tag,
  backgroundColor,
  color,
}: {
  tag: NavigableTag
  backgroundColor: string
  color: string
}) => {
  return (
    <Link tag={tag}>
      <VStack
        width={28}
        height={28}
        borderRadius={1000}
        backgroundColor={backgroundColor}
        shadowColor="#000"
        shadowOpacity={0.1}
        shadowRadius={5}
        shadowOffset={{ height: 1, width: 0 }}
        alignItems="center"
        justifyContent="center"
        hoverStyle={{
          transform: [{ scale: 1.1 }],
        }}
      >
        <Search size={16} color={color} />
      </VStack>
    </Link>
  )
}
