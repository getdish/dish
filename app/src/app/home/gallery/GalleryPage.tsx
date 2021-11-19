import { order_by, photo, useLazyQuery, useQuery, useTransactionQuery } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { AbsoluteYStack, LoadingItems, XStack, YStack, useWindowSize } from '@dish/ui'
import { ChevronLeft, ChevronRight } from '@tamagui/feather-icons'
import { last, orderBy, uniqBy } from 'lodash'
import React, { Suspense, memo, useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView } from 'react-native'

import { isWeb } from '../../../constants/constants'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { getWindowHeight, getWindowWidth } from '../../../helpers/getWindow'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { router, useIsRouteActive } from '../../../router'
import { Image } from '../../views/Image'
import { StackViewCloseButton } from '../../views/StackViewCloseButton'
import { useRestaurantPhotos } from '../restaurant/useRestaurantPhotos'

export default memo(function GalleryPage() {
  const isActive = useIsRouteActive('gallery')

  if (!isActive) {
    return null
  }

  const route = router.curPage

  return (
    <AbsoluteYStack
      fullscreen
      backgroundColor="rgba(0,0,0,0.85)"
      zIndex={1000}
      pointerEvents="auto"
    >
      <AbsoluteYStack top={10} right={10} zIndex={100000}>
        <StackViewCloseButton />
      </AbsoluteYStack>
      <Suspense fallback={<LoadingItems />}>
        <GalleryLightbox
          restaurantSlug={route.params.restaurantSlug}
          index={route.params.offset ? +route.params.offset : 0}
        />
      </Suspense>
    </AbsoluteYStack>
  )
})

const ThumbnailSize = 150

export const GalleryLightbox = memo(
  ({ restaurantSlug, index: defaultIndex = 0 }: { restaurantSlug: string; index?: number }) => {
    const [activeImage, setActiveImage] = useState<{
      index: number
      url: string
    }>(() => {
      return {
        url: '',
        index: defaultIndex,
      }
    })
    const query = useQuery({
      suspense: false,
    })
    const [pagination, setPagination] = useState(() => ({ limit: 20, offset: 0 }))
    const [photosListRaw, setPhotosList] = useState<photo[]>(() => [])
    const [hasLoadedFirstImage, setHasLoadedFirstImage] = useState(false)
    const [restaurant = {} as any] = queryRestaurant(restaurantSlug)
    const { hero } = useRestaurantPhotos(restaurant)
    const photosList = useMemo(() => {
      return hero ? [{ url: hero, quality: 100, id: '00' }, ...photosListRaw] : photosListRaw
    }, [hero, restaurant.image, photosListRaw])

    // ??
    restaurant.id

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
        return photoTable
          .map(({ photo }) => ({
            id: photo.id,
            url: photo.url,
            quality: photo.quality,
          }))
          .filter(isPresent)
      },
      {
        suspense: false,
        onCompleted(data) {
          const bound = (x = 0) => Math.min(2000, Math.round(x / 500) * 500)
          const next = uniqBy(data, (v: any) =>
            getImageUrl(v.url, bound(getWindowWidth()), bound(getWindowHeight()))
          )
          console.log('got photo_table data', data, next)
          setPhotosList(next)
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
            ?.aggregate?.count() ?? 0) > 0
        )
      },
      {
        suspense: false,
        variables: { pagination, restaurant_id: restaurant.id },
      }
    )

    const [fetchMore, state] = useLazyQuery(
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
        suspense: false,
        onCompleted(data) {
          setPhotosList((prev) => {
            const next = orderBy(
              uniqBy([...prev, ...data], (v) => v.url),
              (v) => v.id,
              'desc'
            )
            return next
          })
        },
      }
    )

    let { isLoading } = state

    const activeIndex = activeImage.index

    if (process.env.NODE_ENV === 'development') {
      console.log('👀 GalleryPage', { isLoading, activeIndex, photosList, activeImage, state })
    }

    // fallback ensure always a photo
    const photo = photosList[activeIndex] ?? last(photosList)

    useEffect(() => {
      if (photo?.url) {
        setActiveImage({
          url: photo.url ?? '',
          index: activeIndex,
        })
      }
    }, [activeIndex, photosList])

    const { setLeftImage, setRightImage } = useMemo(
      () => ({
        setLeftImage() {
          setActiveImage((prevActive) => {
            const currentIndex = prevActive.index
            const newIndex = currentIndex - 1 < 0 ? photosList.length - 1 : currentIndex - 1
            if (photosList[newIndex]?.url) {
              return {
                url: photosList[newIndex].url ?? '',
                index: newIndex,
              }
            }
            return prevActive
          })
        },
        setRightImage() {
          setActiveImage((prevActive) => {
            const currentIndex = prevActive.index
            const newIndex = currentIndex + 1 >= photosList.length - 1 ? 0 : currentIndex + 1
            if (photosList[newIndex]?.url) {
              return {
                url: photosList[newIndex].url ?? '',
                index: newIndex,
              }
            }
            return prevActive
          })
        },
      }),
      [photosList]
    )

    if (isWeb) {
      useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
          switch (e.key) {
            case 'ArrowLeft':
              e.preventDefault()
              setLeftImage()
              break
            case 'ArrowRight':
              e.preventDefault()
              setRightImage()
              break
          }
        }
        console.log('add event listener for gallery')
        window.addEventListener('keyup', handleKeyPress, true)
        return () => {
          window.removeEventListener('keyup', handleKeyPress, true)
        }
      }, [setLeftImage, setRightImage])
    }

    if (!restaurant) {
      return null
    }

    return (
      <>
        <XStack flex={1}>
          <YStack
            onPress={setLeftImage}
            cursor="pointer"
            zIndex={100}
            paddingHorizontal={10}
            pointerEvents="auto"
            justifyContent="center"
          >
            <ChevronLeft color="#fff" size={30} />
          </YStack>
          <YStack alignItems="center" justifyContent="center" flex={1} marginVertical={3}>
            {!!activeImage.url && (
              <Image
                source={{ uri: activeImage.url }}
                style={{
                  width: '100%',
                  maxWidth: '95%',
                  height: `100%`,
                }}
                onLoad={() => {
                  setHasLoadedFirstImage(true)
                }}
                resizeMode="contain"
              />
            )}
          </YStack>
          <YStack
            onPress={setRightImage}
            justifyContent="center"
            cursor="pointer"
            pointerEvents="auto"
            zIndex={100}
            paddingHorizontal={10}
          >
            <ChevronRight color="#fff" size={30} />
          </YStack>
        </XStack>

        <YStack height={ThumbnailSize}>
          {hasLoadedFirstImage && (
            <GalleryLightboxPhotosList
              // @ts-expect-error
              photos={photosList}
              onPhotoPress={(photo, index) => {
                setActiveImage({
                  url: photo.url ?? '',
                  index,
                })
              }}
              onFetchMore={() => {
                if (hasMore && !isLoading) {
                  isLoading = true
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
          )}
        </YStack>
      </>
    )
  }
)

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
      ref={scrollView as any}
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
      <XStack
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
            <YStack
              key={index}
              onPress={() => {
                onPhotoPress(photo, index)
              }}
              zIndex={isActive ? 1 : 0}
            >
              <YStack
                scale={isActive ? 1.1 : 1}
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
              </YStack>
            </YStack>
          )
        })}
      </XStack>
    </ScrollView>
  )
}
