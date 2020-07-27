import { HStack, Spacer, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'

import { useMediaQueryIsReallySmall } from './useMediaQueryIs'

export const RestaurantOverview = memo(() => {
  const isReallySmall = useMediaQueryIsReallySmall()

  if (isReallySmall) {
    return listItems.map((item) => {
      return (
        <Text key={item.category}>
          <Text color="rgba(0,0,0,0.5)">{item.category}</Text> {item.review}
          .&nbsp;
        </Text>
      )
    })
  }

  return (
    <VStack marginTop={4} marginBottom={12} maxWidth="100%" flex={1}>
      {/* this ensures the content flexes all the way across, hacky... */}
      <Text opacity={0} lineHeight={0}>
        wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
      </Text>
      {listItems.map((item, index) => (
        <React.Fragment key={item.category}>
          <Text>
            <HStack
              // @ts-ignore
              display="inline-flex"
              width="10%"
              minWidth={50}
              marginRight={2}
              alignItems="center"
              justifyContent="flex-end"
            >
              <Text
                paddingHorizontal={5}
                borderRadius={6}
                fontWeight="300"
                fontSize={16}
                color="rgba(0,0,0,0.5)"
              >
                {item.category}
              </Text>
            </HStack>
            {item.review}
          </Text>
          {index < listItems.length - 1 && <Spacer size={4} />}
        </React.Fragment>
      ))}
    </VStack>
  )
})

const listItems = [
  {
    category: 'food',
    review: `Don't miss the lychee tempura ice cream`,
  },
  {
    category: 'vibe',
    review: 'Authentic. Big bar area outside with shade',
  },
  // {
  //   category: 'Tips',
  //   review: 'Quick, cheap, local favorite',
  // },
]
