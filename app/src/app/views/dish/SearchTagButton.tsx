import { NavigableTag } from '../../../types/tagTypes'
import { Link } from '../Link'
import { YStack } from '@dish/ui'
import { Search } from '@tamagui/feather-icons'
import React from 'react'

export const SearchTagButton = ({ tag, color }: { tag: NavigableTag; color?: string }) => {
  return (
    <Link tag={tag}>
      <YStack
        width={28}
        height={28}
        borderRadius={1000}
        backgroundColor="$bg"
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
        <Search size={16} color={color?.toString() || '#777'} />
      </YStack>
    </Link>
  )
}
