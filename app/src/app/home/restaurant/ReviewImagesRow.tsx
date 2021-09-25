import { useRefetch } from '@dish/graph'
import { Camera } from '@dish/react-feather'
import React, { useEffect } from 'react'
import { AbsoluteVStack, Button, HStack, StackProps, Toast, VStack, useTheme } from 'snackui'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { Image } from '../../views/Image'
import { Link } from '../../views/Link'
import { SmallButton } from '../../views/SmallButton'
import { RestaurantReviewProps } from './RestaurantReview'
import { usePickImage } from './usePickImage'
import { useRestaurantPhotos } from './useRestaurantPhotos'

export const ReviewImagesRow = ({
  list,
  review,
  isEditing,
  floating,
  restaurantSlug,
  showGenericImages,
  imgWidth = 170,
  imgHeight = 130,
  ...stackProps
}: RestaurantReviewProps & {
  floating?: boolean
  imgWidth?: number
  imgHeight?: number
  showGenericImages?: boolean
}) => {
  const refetch = useRefetch()
  // headers get lowercased over the wire
  const pickImage = usePickImage({
    restaurantSlug,
    reviewId: review?.id,
  })
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

  const myImages = [...pickImage.photos, ...photos]
  const allImages = [...new Set([...myImages, ...genericPhotos])]

  // newPhotos.length ? newPhotos : isEditing ? [{ uri: '' }] : []
  // const imageUploadForm = useImageUploadForm('reviewImages')

  useEffect(() => {
    return () => {
      Toast.clear()
    }
  }, [])

  const addButton = floating ? (
    <Button
      pointerEvents="auto"
      themeInverse
      borderRadius={100}
      width={55}
      height={55}
      alignItems="center"
      justifyContent="center"
      elevation={3}
      noTextWrap
      onPress={pickImage.pick}
    >
      <Camera size={20} color="#888" />
    </Button>
  ) : (
    <>
      {(isEditing || !myImages.length) && (
        <SmallButton onPress={pickImage.pick}>Add photos</SmallButton>
      )}
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
