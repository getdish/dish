import { graphql } from '@dish/graph'
import { HStack, LinearGradient } from '@dish/ui'
import { memo } from 'react'
import { Image, ScrollView, StyleSheet } from 'react-native'

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
        <HStack paddingVertical={5} alignItems="center">
          {!photos.length && (
            <HStack
              height={185}
              minWidth={185}
              // backgroundColor={bgLight}
              borderRadius={20}
            >
              {/* <Text>No photos!</Text> */}
            </HStack>
          )}
          {!!photos.length && (
            <HStack alignItems="center">
              {/* <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.1)', 'transparent']}
                startPoint={[0, 1]}
                endPoint={[0, 0]}
                pointerEvents="none"
                style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
              /> */}
              {photos.slice(0, 9).map((photo, key) => (
                <LinkButton
                  key={key}
                  name="gallery"
                  params={{ restaurantSlug }}
                  className="scale-hover"
                  {...(key == 0 && {
                    borderTopLeftRadius: 15,
                    borderBottomLeftRadius: 15,
                  })}
                >
                  <Image
                    source={{ uri: getImageUrl(photo, 280, 180, 100) }}
                    style={{
                      height: 185,
                      width: 135,
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
