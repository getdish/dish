import { query, uploadFile, useRefetch } from '@dish/graph'
import * as ImagePicker from 'expo-image-picker'
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types'
import { uniqBy } from 'lodash'
import React, { useEffect, useState } from 'react'
import { AbsoluteVStack, Button, HStack, StackProps, Toast, VStack, useTheme } from 'snackui'

import { isWeb } from '../../../constants/constants'
import { useIsMountedRef } from '../../../helpers/useIsMountedRef'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { useUserStore } from '../../userStore'
import { Image } from '../../views/Image'
import { Link } from '../../views/Link'
import { SmallButton } from '../../views/SmallButton'
import { createImageFormData } from './createImageFormData'
import { RestaurantReviewProps } from './RestaurantReview'
import { useRestaurantPhotos } from './useRestaurantPhotos'

export const ReviewImagesRow = ({
  list,
  review,
  isEditing,
  restaurantSlug,
  showGenericImages,
  imgWidth = 170,
  imgHeight = 130,
  ...stackProps
}: RestaurantReviewProps & {
  imgWidth?: number
  imgHeight?: number
  showGenericImages?: boolean
}) => {
  const refetch = useRefetch()
  const genericPhotos =
    showGenericImages && restaurantSlug
      ? useRestaurantPhotos(queryRestaurant(restaurantSlug)[0], 5)?.photos || []
      : []

  const photos = restaurantSlug
    ? list?.user
        ?.photo_xrefs({
          where: {
            restaurant: {
              slug: {
                _eq: restaurantSlug,
              },
            },
          },
          limit: 30,
        })
        .map((xref) => xref.photo.url) || []
    : review
        ?.photos({
          limit: 30,
        })
        .map((xref) => xref.photo.url) || []

  const [newPhotos, setNewPhotos] = useState<string[]>([])
  const myImages = [...newPhotos, ...photos]
  const allImages = [...new Set([...myImages, ...genericPhotos])]

  // newPhotos.length ? newPhotos : isEditing ? [{ uri: '' }] : []
  const isMounted = useIsMountedRef()
  // const imageUploadForm = useImageUploadForm('reviewImages')

  // headers have different constraints
  const reviewid = review?.id

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    })

    console.log('result', result)
    if (!isMounted.current) return

    if (!('selected' in result)) {
      Toast.show(`No images selected`)
      return
    }

    if (!result.cancelled) {
      setNewPhotos(result.selected.map((x) => x.uri))
    }

    for (const [index, { uri, height, width }] of result.selected.entries()) {
      const formData = createImageFormData(`image-${index}`, uri)
      Toast.show(`Adding photos #${index + 1}`, { duration: 60_000 * 3 })
      const headers = {
        // sending undefined sends an undefined string
        ...(restaurantSlug && {
          restaurantslug: restaurantSlug,
        }),
        ...(!!reviewid && {
          reviewid,
        }),
      }
      const res = await uploadFile('reviewImages', formData, {
        headers,
      })
      if (!res) {
        Toast.error(`Couldn't upload :(`)
        setNewPhotos([])
        return
      }
      if (!isMounted.current) return
    }

    Toast.show(`All images uploaded`)
    refetch(photos)
  }

  useEffect(() => {
    return () => {
      Toast.clear()
    }
  }, [])

  const addButton = (
    <>
      {(isEditing || !myImages.length) && <SmallButton onPress={pickImage}>Add photos</SmallButton>}
    </>
  )

  if (!allImages.length) {
    return <HStack>{addButton}</HStack>
  }

  return (
    <HStack position="relative" alignItems="center" spacing {...stackProps}>
      <AbsoluteVStack top={5} left={0} zIndex={100}>
        {isEditing ? addButton : null}
      </AbsoluteVStack>
      {allImages.map((uri, index) => {
        if (uri === '') {
          return <ImageFrame key={uri || index} />
        }
        const offset = index - myImages.length
        const content = (
          <ImageFrame
            key={uri || index}
            width={imgWidth}
            height={imgHeight}
            // opacity={isEditing && index > myImages.length - 1 ? 0.5 : 1}
          >
            <Image source={{ uri: uri || '' }} style={{ width: imgWidth, height: imgHeight }} />
          </ImageFrame>
        )

        if (offset >= 0) {
          return (
            <Link
              key={uri || index}
              name="gallery"
              params={{ restaurantSlug: restaurantSlug || '', offset }}
            >
              {content}
            </Link>
          )
        }

        return content
      })}
    </HStack>
  )
}

const ImageFrame = (props: StackProps) => {
  const theme = useTheme()
  return <VStack backgroundColor={theme.backgroundColorSecondary} {...props} />
}
