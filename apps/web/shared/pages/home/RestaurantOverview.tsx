import { HStack, Spacer, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'

import { useMediaQueryIsReallySmall } from './useMediaQueryIs'

export const RestaurantOverview = memo(
  ({
    inline,
    number,
  }: {
    restaurantSlug: string
    inline?: boolean
    limit?: number
  }) => {
    const isReallySmall = useMediaQueryIsReallySmall()

    if (isReallySmall) {
      return (
        <>
          {listItems.map((item) => {
            return (
              <Text key={item.category}>
                <Text color="rgba(0,0,0,0.5)">{item.category}</Text>{' '}
                {item.review}
                .&nbsp;
              </Text>
            )
          })}
        </>
      )
    }

    return (
      <>
        {listItems.map((item, index) => (
          <React.Fragment key={item.category}>
            <VStack
              {...(!inline && {
                borderWidth: 1,
                borderColor: '#eee',
                borderRadius: 8,
                margin: 4,
                marginBottom: 0,
                marginRight: 0,
                padding: 10,
                flex: 1,
              })}
            >
              <Text fontSize={15}>
                <HStack
                  // @ts-ignore
                  display="inline-flex"
                  width="10%"
                  minWidth={50}
                  marginRight={2}
                  alignItems="center"
                  justifyContent="flex-end"
                  {...(!inline && {
                    width: 'auto',
                    minWidth: 'auto',
                  })}
                >
                  <Text
                    paddingHorizontal={5}
                    borderRadius={18}
                    fontWeight="400"
                    color="rgba(0,0,0,0.5)"
                  >
                    {item.category}
                  </Text>
                </HStack>
                {item.review}
              </Text>
            </VStack>
            {index < listItems.length - 1 && <Spacer size={4} />}
          </React.Fragment>
        ))}
      </>
    )
  }
)

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
