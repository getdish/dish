import { photo, useQuery } from '@dish/graph'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, Image, ScaledSize, ScrollView, View } from 'react-native'
import useKeyPressEvent from 'react-use/lib/useKeyPressEvent'
import { Box, Button, HStack, Text, VStack } from 'snackui'

import { isWeb } from '../constants'

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState(() => {
    const { width, height } = Dimensions.get('screen')

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
}: {
  photos: photo[]
  onPhotoPress: (photo: photo, index: number) => void
  activeImage: {
    index: number
    url: string
  }
}) => {
  const scrollView = useRef<ScrollView>()

  const currentScroll = useRef(0)

  const [borderScroll, setBorderScroll] = useState<
    'left' | 'right' | undefined
  >()

  const { width } = useScreenSize()

  const maxScrollRight = useMemo(() => {
    return (photos.length - width / ThumbnailSize / 2 - 2) * ThumbnailSize
  }, [photos.length, width])

  useEffect(() => {
    if (!scrollView.current) return

    const x = Math.max(
      0,
      activeIndex * ThumbnailSize -
        (width / ThumbnailSize / 3 - (width > 1000 ? 1 : 0)) * ThumbnailSize
    )

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
  index = 0,
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
      index,
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

  if (!restaurant) return null

  const photos_xref = restaurant.photo_table({
    limit: 30,
  })

  const photos = useMemo(
    () =>
      photos_xref
        .map(({ photo }) => photo)
        .filter((photo) => Boolean(photo.url)),
    [photos_xref]
  )

  useEffect(() => {
    if (photos[index]?.url) {
      setActiveImage({
        url: photos[index].url,
        index,
      })
    }
  }, [index, setActiveImage, photos])

  if (isWeb) {
    useKeyPressEvent('ArrowLeft', () => {
      setActiveImage((prevActive) => {
        const currentIndex = prevActive.index

        let newIndex =
          currentIndex - 1 < 0 ? photos.length - 1 : currentIndex - 1
        if (photos[newIndex]?.url) {
          return {
            url: photos[newIndex].url,
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
          currentIndex + 1 >= photos.length - 1 ? 0 : currentIndex + 1
        if (photos[newIndex]?.url) {
          return {
            url: photos[newIndex].url,
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
          photos={photos}
          onPhotoPress={(photo, index) => {
            setActiveImage({
              url: photo.url,
              index,
            })
          }}
          activeImage={activeImage}
        />
      </VStack>
    </ScrollView>
  )
}
