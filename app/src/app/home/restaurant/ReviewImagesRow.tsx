import { uploadFile, useRefetch } from '@dish/graph'
import * as ImagePicker from 'expo-image-picker'
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types'
import { uniqBy } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Button, HStack, StackProps, Toast, VStack, useTheme } from 'snackui'

import { isWeb } from '../../../constants/constants'
import { useIsMountedRef } from '../../../helpers/useIsMountedRef'
import { useUserStore } from '../../userStore'
import { Image } from '../../views/Image'
import { RestaurantReviewProps } from './RestaurantReview'

const imgWidth = 170
const imgHeight = 130

const getImageFileType = (imageUrl: string) => {
  if (imageUrl.startsWith('data:')) {
    return imageUrl.match(/image\/([a-z]+)/i)?.[1]
  }
  const uriParts = imageUrl.split('.')
  return uriParts[uriParts.length - 1]
}

const createImageFormData = (name: string, uri: string) => {
  const formData = new FormData()
  const fileType = getImageFileType(uri)
  if (uri.startsWith('data:')) {
    const file = DataURIToBlob(uri)
    formData.append('review-image', file, `${name}.${fileType}`)
  } else {
    // @ts-ignore
    formData.append('photo', {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    })
  }
  return formData
}

function DataURIToBlob(dataURI: string) {
  const splitDataURI = dataURI.split(',')
  const byteString =
    splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0]
  const ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ia], { type: mimeString })
}

export const ReviewImagesRow = ({
  list,
  review,
  isEditing,
  restaurantId,
  restaurantSlug,
  ...stackProps
}: RestaurantReviewProps & {
  restaurantId?: string
}) => {
  const refetch = useRefetch()
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
  const allImages = uniqBy([...newPhotos, ...photos], (x) => x?.['uri'])

  // newPhotos.length ? newPhotos : isEditing ? [{ uri: '' }] : []
  const isMounted = useIsMountedRef()
  // const imageUploadForm = useImageUploadForm('reviewImages')

  // headers have different constraints
  const restaurantid = restaurantId ?? review?.restaurant_id
  const reviewid = review?.id

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!isMounted.current) return

    console.log(result)

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
        ...(restaurantid && {
          restaurantid,
        }),
        ...(!!reviewid && {
          reviewid,
        }),
      }
      console.log('sending headers', headers)
      const res = await uploadFile('reviewImages', formData, {
        headers,
      })
      if (!res) {
        Toast.error(`Couldn't upload :(`)
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
    <>{(isEditing || !allImages.length) && <Button onPress={pickImage}>Add photos</Button>}</>
  )

  if (!allImages.length) {
    return <HStack>{addButton}</HStack>
  }

  return (
    <HStack alignItems="center" spacing {...stackProps}>
      {allImages.map((uri) => {
        if (uri === '') {
          return <ImageFrame key={uri} />
        }
        return (
          <ImageFrame key={uri}>
            <Image source={{ uri: uri || '' }} style={{ width: imgWidth, height: imgHeight }} />
          </ImageFrame>
        )
      })}
    </HStack>
  )
}

const ImageFrame = (props: StackProps) => {
  const theme = useTheme()
  return (
    <VStack
      backgroundColor={theme.backgroundColorSecondary}
      width={imgWidth}
      height={imgHeight}
      {...props}
    />
  )
}
