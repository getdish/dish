import {
  order_by,
  photo,
  useLazyQuery,
  useQuery,
  useTransactionQuery,
} from '@dish/graph'
import { ChevronLeft, ChevronRight } from '@dish/react-feather'
import { orderBy, uniqBy } from 'lodash'
import React, {
  Suspense,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Image, ScrollView } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  LoadingItems,
  VStack,
  useWindowSize,
} from 'snackui'

import { isWeb } from '../../../constants/constants'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import {
  homeStore,
  useCurrentHomeType,
  useHomeStore,
  useIsHomeTypeActive,
} from '../../homeStore'
import { StackViewCloseButton } from '../../views/StackViewCloseButton'

export default memo(function GalleryPage() {
  const isActive = useIsHomeTypeActive('gallery')
  if (!isActive) return null

  return (
    <AbsoluteVStack
      fullscreen
      backgroundColor="rgba(0,0,0,0.85)"
      zIndex={1000}
      pointerEvents="auto"
    >
      <AbsoluteVStack top={10} right={10} zIndex={100000}>
        <StackViewCloseButton />
      </AbsoluteVStack>
      <Suspense fallback={<LoadingItems />}>
        <GalleryLightbox
          restaurantSlug={homeStore.currentState['restaurantSlug']}
        />
      </Suspense>
    </AbsoluteVStack>
  )
})

const ThumbnailSize = 150

export const GalleryLightbox = ({
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
  const [restaurant] = queryRestaurant(restaurantSlug)
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

  useEffect(() => {
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
    useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowLeft':
            setLeftImage()
            break
          case 'ArrowRight':
            setRightImage()
            break
        }
      }
      window.addEventListener('keyup', handleKeyPress)
      return () => {
        window.removeEventListener('keyup', handleKeyPress)
      }
    }, [])
  }

  return (
    <>
      <HStack flex={1}>
        <VStack
          onPress={setLeftImage}
          cursor="pointer"
          zIndex={100}
          paddingHorizontal={10}
          pointerEvents="auto"
          justifyContent="center"
        >
          <ChevronLeft color="#fff" size={30} />
        </VStack>
        <VStack
          alignItems="center"
          justifyContent="center"
          flex={1}
          marginVertical={3}
        >
          {!!activeImage.url && (
            <Image
              source={{ uri: activeImage.url }}
              style={{
                width: '100%',
                maxWidth: '95%',
                height: `100%`,
              }}
              resizeMode="contain"
            />
          )}
        </VStack>
        <VStack
          onPress={setRightImage}
          justifyContent="center"
          cursor="pointer"
          pointerEvents="auto"
          zIndex={100}
          paddingHorizontal={10}
        >
          <ChevronRight color="#fff" size={30} />
        </VStack>
      </HStack>

      <GalleryLightboxPhotosList
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

const GalleryLightboxPhotosList = ({
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
  const [width] = useWindowSize()

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
    <ScrollView
      horizontal
      ref={scrollView}
      onScroll={(ev) => {
        currentScroll.current = ev.nativeEvent.contentOffset.x
        if (ev.nativeEvent.contentOffset.x >= maxScrollRight) {
          onFetchMore()
        }
      }}
      style={{
        paddingVertical: 10,
        maxHeight: ThumbnailSize,
      }}
      scrollEventThrottle={100}
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
          const isActive = activeImageUrl === url

          return (
            <VStack
              key={index}
              onPress={() => {
                onPhotoPress(photo, index)
              }}
              zIndex={isActive ? 1 : 0}
            >
              <VStack
                transform={[{ scale: isActive ? 1.1 : 1 }]}
                shadowOpacity={isActive ? 1 : 0}
                shadowColor="#000"
                shadowRadius={10}
              >
                <Image
                  source={{
                    uri: getImageUrl(url, ThumbnailSize, ThumbnailSize),
                  }}
                  style={{
                    width: ThumbnailSize,
                    height: ThumbnailSize,
                    opacity: isActive ? 1 : 0.8,
                  }}
                  resizeMode="cover"
                />
              </VStack>
            </VStack>
          )
        })}
      </HStack>
    </ScrollView>
  )
}
