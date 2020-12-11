import { photo, useQuery } from '@dish/graph'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, Image, ScaledSize, ScrollView } from 'react-native'
import useKeyPressEvent from 'react-use/lib/useKeyPressEvent'
import { HStack, VStack } from 'snackui'

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
  activeIndex,
}: {
  photos: photo[]
  onPhotoPress: (photo: photo, index: number) => void
  activeIndex: number
}) => {
  const scrollView = useRef<ScrollView>()

  const { width } = useScreenSize()

  useEffect(() => {
    if (!scrollView.current) return

    scrollView.current.scrollTo({
      animated: true,
      x: Math.max(
        0,
        activeIndex * ThumbnailSize -
          (width / ThumbnailSize / 2) * ThumbnailSize
      ),
    })
  }, [activeIndex, width])

  return (
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
          if (!photo.url) return null

          return (
            <VStack
              key={index}
              onPress={() => {
                onPhotoPress(photo, index)
              }}
            >
              <Image
                source={{ uri: photo.url }}
                style={{
                  width: ThumbnailSize + 'px',
                  height: ThumbnailSize + 'px',
                }}
                resizeMode="cover"
              />
            </VStack>
          )
        })}
      </HStack>
    </ScrollView>
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
  }>(null)
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
    if (index != null) {
      if (photos[index]?.url) {
        setActiveImage({
          url: photos[index].url,
          index,
        })
      }
    }
  }, [index, setActiveImage, photos])

  if (isWeb) {
    const currentIndex = activeImage?.index ?? index

    useKeyPressEvent('ArrowLeft', () => {
      let newIndex = currentIndex - 1 < 0 ? photos.length - 1 : currentIndex - 1
      if (photos[newIndex]?.url && activeImage.index !== newIndex) {
        setActiveImage({
          url: photos[newIndex].url,
          index: newIndex,
        })
      }
    })

    useKeyPressEvent('ArrowRight', () => {
      let newIndex =
        currentIndex + 1 >= photos.length - 1 ? 0 : currentIndex + 1
      if (photos[newIndex]?.url && activeImage.url !== photos[newIndex]?.url) {
        setActiveImage({
          url: photos[newIndex].url,
          index: newIndex,
        })
      }
    })
  }

  return (
    <VStack>
      {activeImage && (
        <VStack>
          <Image
            source={{ uri: activeImage.url }}
            style={{ width: '100%', height: '600px' }}
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
        activeIndex={activeImage?.index ?? index}
      />
    </VStack>
  )
}
