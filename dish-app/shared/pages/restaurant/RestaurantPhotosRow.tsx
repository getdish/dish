import { graphql } from '@dish/graph'
import { HStack, Text } from '@dish/ui'
import { memo } from 'react'
import { ScrollView } from 'react-native'
import { Image } from 'react-native'

import { bgLight } from '../../colors'
import { getImageUrl } from '../../helpers/getImageUrl'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { LinkButton } from '../../views/ui/LinkButton'
import { SmallLinkButton } from '../../views/ui/SmallButton'

export const RestaurantPhotosRow = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const photos = restaurant.photos() ?? []
    return (
      <ScrollView
        style={{ width: '100%' }}
        horizontal
        showsVerticalScrollIndicator={false}
      >
        <HStack alignItems="center">
          {!photos.length && (
            <HStack
              height={200}
              minWidth={200}
              // backgroundColor={bgLight}
              borderRadius={20}
            >
              {/* <Text>No photos!</Text> */}
            </HStack>
          )}
          {!!photos.length && (
            <HStack alignItems="center">
              {photos.slice(0, 9).map((photo, key) => (
                <LinkButton
                  key={key}
                  name="gallery"
                  params={{ restaurantSlug }}
                >
                  <Image
                    source={{ uri: getImageUrl(photo, 280, 180, 100) }}
                    style={{
                      height: 200,
                      width: 130,
                      // borderRadius: 20,
                    }}
                    resizeMode="cover"
                  />
                </LinkButton>
              ))}
              <SmallLinkButton
                alignSelf="stretch"
                name="gallery"
                params={{ restaurantSlug }}
              >
                View Gallery
              </SmallLinkButton>
            </HStack>
          )}
        </HStack>
      </ScrollView>
    )
  })
)
