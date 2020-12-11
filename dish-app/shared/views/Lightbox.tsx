import {
  client,
  order_by,
  photo,
  photo_xref,
  resolved,
  useLazyQuery,
  useQuery,
  useTransactionQuery,
} from '@dish/graph'
import { orderBy, sortBy, uniqBy } from 'lodash'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, Image, ScaledSize, ScrollView, View } from 'react-native'
import useKeyPressEvent from 'react-use/lib/useKeyPressEvent'
import { Button, HStack, Text, VStack } from 'snackui'

import { isWeb } from '../constants'

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

  const [borderScroll, setBorderScroll] = useState<
    'left' | 'right' | undefined
  >()

  useEffect(() => {
    if (borderScroll === 'right') {
      onFetchMore()
    }
  }, [borderScroll, currentScroll.current])

  const { width } = useScreenSize()

  const maxScrollRight = useMemo(() => {
    return (photos.length - width / ThumbnailSize / 2 - 2) * ThumbnailSize
  }, [photos.length, width])

  useEffect(() => {
    if (!scrollView.current) return

    const x = Math.max(0, activeIndex * ThumbnailSize)

    if (x >= maxScrollRight) {
      setBorderScroll('right')
    } else if (x === 0) {
      setBorderScroll('left')
    } else {
      setBorderScroll(undefined)
    }

    currentScroll.current = x

    scrollView.current.scrollTo({
      animated: true,
      x,
    })
  }, [activeIndex, width, maxScrollRight])

  const scrollLeft = useCallback(() => {
    if (!scrollView.current) return

    const x = Math.max(currentScroll.current - 300, 0)

    if (x === 0) {
      setBorderScroll('left')
    } else {
      setBorderScroll(undefined)
    }

    currentScroll.current = x

    scrollView.current.scrollTo({
      animated: true,
      x,
    })
  }, [scrollView, photos])

  const scrollRight = useCallback(() => {
    if (!scrollView.current) return

    const x = Math.min(currentScroll.current + 300, maxScrollRight)

    if (x >= maxScrollRight) {
      setBorderScroll('right')
    } else {
      setBorderScroll(undefined)
    }

    currentScroll.current = x

    scrollView.current.scrollTo({
      animated: true,
      x,
    })
  }, [scrollView, photos, width, maxScrollRight])

  return (
    <>
      <Button
        onPress={scrollLeft}
        position="absolute"
        zIndex={10000000}
        left={1}
        bottom={70}
        backgroundColor="white"
        hoverStyle={{
          backgroundColor: 'white',
        }}
        display={borderScroll === 'left' ? 'none' : undefined}
      >
        <Text color="black">{'<-'}</Text>
      </Button>
      <ScrollView
        style={{
          width: isWeb ? 'calc(100% + 30px)' : '98%',
          marginHorizontal: -15,
          maxWidth: '100vw',
        }}
        horizontal
        ref={scrollView}
      >
        <HStack paddingTop={20} alignItems="center" justifyContent="center">
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
                    opacity: activeImageUrl === url ? 1 : 0.7,
                  }}
                  resizeMode="cover"
                />
              </VStack>
            )
          })}
        </HStack>
      </ScrollView>
      <Button
        onPress={scrollRight}
        position="absolute"
        zIndex={10000000}
        right={1}
        bottom={70}
        backgroundColor="white"
        hoverStyle={{
          backgroundColor: 'white',
        }}
        display={borderScroll === 'right' ? 'none' : undefined}
      >
        <Text color="black">{'->'}</Text>
      </Button>
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

  const restaurant = query.restaurant({
    where: {
      slug: {
        _eq: restaurantSlug,
      },
    },
  })[0]

  if (!restaurant) throw Error('No restaurant available')

  restaurant.id

  const [pagination, setPagination] = useState(() => ({ limit: 20, offset: 0 }))

  const [photosList, setPhotosList] = useState<photo[]>(() => [])

  useTransactionQuery(
    () => {
      const photosxRef = restaurant.photo_table({
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

      photosxRef.forEach(({ photo }) => {
        photo.id
        photo.url
        photo.quality
      })

      return photosxRef.map((v) => v.photo)
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

  const [fetchMore] = useLazyQuery(
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
  useEffect(() => {
    if (photosList[activeIndex]?.url) {
      setActiveImage({
        url: photosList[activeIndex].url,
        index: activeIndex,
      })
    }
  }, [activeIndex, setActiveImage, photosList])

  if (isWeb) {
    useKeyPressEvent('ArrowLeft', () => {
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
    })

    useKeyPressEvent('ArrowRight', () => {
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
    })
  }

  return (
    <ScrollView>
      <VStack maxHeight="100%">
        {activeImage.url && (
          <VStack>
            <Image
              source={{ uri: activeImage.url }}
              style={{
                width: '100%',
                height: '600px',
                maxHeight: `calc(100vh - ${ThumbnailSize}px - 50px)`,
              }}
              resizeMode="contain"
            />
          </VStack>
        )}
        <PhotosList
          photos={photosList}
          onPhotoPress={(photo, index) => {
            setActiveImage({
              url: photo.url,
              index,
            })
          }}
          onFetchMore={() => {
            if (hasMore) {
              fetchMore({
                args: pagination,
              }).then((data) => {
                setPagination({
                  limit: pagination.limit,
                  offset: pagination.offset + data.length,
                })
              })
            } else {
              // No more photos left
            }
          }}
          activeImage={activeImage}
        />
      </VStack>
    </ScrollView>
  )
}
