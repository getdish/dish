import {
  order_by,
  photo,
  useLazyQuery,
  useQuery,
  useTransactionQuery,
} from '@dish/graph'
import { ChevronLeft, ChevronRight } from '@dish/react-feather'
import { orderBy, uniqBy } from 'lodash'
import React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, Image, ScaledSize, ScrollView } from 'react-native'
import useKeyPressEvent from 'react-use/lib/useKeyPressEvent'
import { HStack, VStack } from 'snackui'

import { isWeb } from '../../constants/constants'
import { useRestaurantQuery } from '../hooks/useRestaurantQuery'

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState(() => {
    const { width, height } = Dimensions.get('window')
    return {
      width,
      height,
    }
  })

  useEffect(() => {
    const listener = ({
      screen: { width, height },
    }: {
      screen: ScaledSize
    }) => {
      setScreenSize({ height, width })
    }
    Dimensions.addEventListener('change', listener)
    return () => {
      Dimensions.removeEventListener('change', listener)
    }
  }, [setScreenSize])

  return screenSize
}

const ThumbnailSize = 150

const PhotosList = ({
  photos,
  onPhotoPress,
  activeImage: { index: activeIndex, url: activeImageUrl },
  onFetchMore,
}: {
  photos: photo[]
  onPhotoPress: (photo: photo, index: number) => void
  activeImage: {
    index: number
    url: string
  }
  onFetchMore: () => void
}) => {
  const scrollView = useRef<ScrollView>()
  const currentScroll = useRef(0)
  const { width } = useScreenSize()

  const maxScrollRight = useMemo(() => {
    return (photos.length - width / ThumbnailSize / 1) * ThumbnailSize
  }, [photos.length, width])

  const maxScrollRightRef = useRef(maxScrollRight)
  maxScrollRightRef.current = maxScrollRight

  useEffect(() => {
    if (!scrollView.current) {
      return
    }
    const x = Math.max(0, activeIndex * ThumbnailSize)
    currentScroll.current = x
    scrollView.current.scrollTo({
      animated: true,
      x,
    })
  }, [activeIndex, width])

  return (
    <>
      <ScrollView
        horizontal
        ref={scrollView}
        onScroll={(ev) => {
          currentScroll.current = ev.nativeEvent.contentOffset.x
          if (ev.nativeEvent.contentOffset.x >= maxScrollRight) {
            onFetchMore()
          }
        }}
        scrollEventThrottle={1}
      >
        <HStack
          bottom={0}
          position="absolute"
          paddingTop={2}
          alignItems="center"
          justifyContent="center"
        >
          {photos.map((photo, index) => {
            const { url } = photo
            if (!url) return null

            return (
              <VStack
                key={index}
                onPress={() => {
                  onPhotoPress(photo, index)
                }}
                paddingHorizontal="2px"
              >
                <Image
                  source={{ uri: url }}
                  style={{
                    width: ThumbnailSize + 'px',
                    height: ThumbnailSize + 'px',
                    opacity: activeImageUrl === url ? 1 : 0.6,
                  }}
                  resizeMode="cover"
                />
              </VStack>
            )
          })}
        </HStack>
      </ScrollView>
    </>
  )
}

export const Lightbox = ({
  restaurantSlug,
  index: defaultIndex = 0,
}: {
  restaurantSlug: string
  index?: number
}) => {
  const [activeImage, setActiveImage] = useState<{
    index: number
    url: string
  }>(() => {
    return {
      url: '',
      index: defaultIndex,
    }
  })
  const query = useQuery()
  const restaurant = useRestaurantQuery(restaurantSlug)
  restaurant.id
  const [pagination, setPagination] = useState(() => ({ limit: 20, offset: 0 }))
  const [photosList, setPhotosList] = useState<photo[]>(() => [])

  useTransactionQuery(
    () => {
      const photoTable = restaurant.photo_table({
        limit: pagination.limit,
        offset: 0,
        order_by: [
          {
            photo: {
              quality: order_by.desc,
            },
          },
        ],
      })
      photoTable.forEach(({ photo }) => {
        photo.id
        photo.url
        photo.quality
      })

      return photoTable.map((v) => v.photo)
    },
    {
      onCompleted(data) {
        setPhotosList(uniqBy(data, (v) => v.url))
      },
    }
  )

  const { data: hasMore } = useTransactionQuery(
    (_query, { pagination, restaurant_id }) => {
      return (
        (query
          .photo_xref_aggregate({
            where: {
              restaurant_id: {
                _eq: restaurant_id,
              },
            },
            ...pagination,
          })
          .aggregate.count() ?? 0) > 0
      )
    },
    {
      variables: { pagination, restaurant_id: restaurant.id },
    }
  )

  let [fetchMore, { isLoading: isFetchingMore }] = useLazyQuery(
    (_query, { limit, offset }: typeof pagination) => {
      const photo_table = restaurant.photo_table({
        limit,
        offset,
        order_by: [
          {
            photo: {
              quality: order_by.desc,
            },
          },
        ],
      })
      return photo_table.map(({ photo }) => {
        photo.id
        photo.url
        photo.quality
        return photo
      })
    },
    {
      onCompleted(data) {
        setPhotosList((prev) =>
          orderBy(
            uniqBy([...prev, ...data], (v) => v.url),
            (v) => v.quality,
            'desc'
          )
        )
      },
    }
  )

  const activeIndex = activeImage.index
  console.log('what is', activeImage)
  useEffect(() => {
    console.log(
      'setting active index',
      activeIndex,
      photosList,
      photosList[activeIndex]?.url
    )
    if (photosList[activeIndex]?.url) {
      setActiveImage({
        url: photosList[activeIndex].url,
        index: activeIndex,
      })
    }
  }, [activeIndex, setActiveImage, photosList])

  const setLeftImage = () =>
    setActiveImage((prevActive) => {
      const currentIndex = prevActive.index

      let newIndex =
        currentIndex - 1 < 0 ? photosList.length - 1 : currentIndex - 1
      if (photosList[newIndex]?.url) {
        return {
          url: photosList[newIndex].url,
          index: newIndex,
        }
      }

      return prevActive
    })

  const setRightImage = () => {
    setActiveImage((prevActive) => {
      const currentIndex = prevActive.index

      let newIndex =
        currentIndex + 1 >= photosList.length - 1 ? 0 : currentIndex + 1
      if (photosList[newIndex]?.url) {
        return {
          url: photosList[newIndex].url,
          index: newIndex,
        }
      }

      return prevActive
    })
  }
  if (isWeb) {
    useKeyPressEvent('ArrowLeft', setLeftImage)

    useKeyPressEvent('ArrowRight', setRightImage)
  }

  return (
    <>
      <VStack marginTop={3}>
        {!!activeImage.url && (
          <VStack>
            <Image
              source={{ uri: activeImage.url }}
              style={{
                width: '100%',
                maxWidth: '95%',
                height: `100%`,
              }}
              resizeMode="contain"
            />
          </VStack>
        )}
      </VStack>

      <VStack
        onPress={setLeftImage}
        position="absolute"
        left={10}
        top="50%"
        transform={[{ translateY: -ThumbnailSize / 2 - 30 / 2 }]}
        cursor="pointer"
        zIndex={100}
        pointerEvents="auto"
      >
        <ChevronLeft color="#fff" size={30} />
      </VStack>
      <VStack
        onPress={setRightImage}
        position="absolute"
        right={10}
        top="50%"
        transform={[{ translateY: -ThumbnailSize / 2 - 30 / 2 }]}
        cursor="pointer"
        pointerEvents="auto"
        zIndex={100}
      >
        <ChevronRight color="#fff" size={30} />
      </VStack>
      <PhotosList
        photos={photosList}
        onPhotoPress={(photo, index) => {
          setActiveImage({
            url: photo.url,
            index,
          })
        }}
        onFetchMore={() => {
          if (hasMore && !isFetchingMore) {
            isFetchingMore = true
            fetchMore({
              args: pagination,
            })
              .then((data) => {
                setPagination({
                  limit: pagination.limit,
                  offset: pagination.offset + data.length,
                })
              })
              .catch(console.error)
          } else {
            // No more photos left
          }
        }}
        activeImage={activeImage}
      />
    </>
  )
}
