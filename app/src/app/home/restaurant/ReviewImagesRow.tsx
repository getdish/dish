import * as ImagePicker from 'expo-image-picker'
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types'
import React, { useState } from 'react'
import { Button, Circle, HStack, Paragraph, StackProps, VStack, useTheme } from 'snackui'

import { Image } from '../../views/Image'
import { RestaurantReviewProps } from './RestaurantReview'

const imgWidth = 160
const imgHeight = 110

export const ReviewImagesRow = ({
  list,
  review,
  isEditing,
  ...stackProps
}: RestaurantReviewProps) => {
  const [images, setImages] = useState<ImageInfo[]>([])
  const allImages = images.length ? images : isEditing ? [{ uri: '' }] : []

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    })

    console.log(result)

    if (!result.cancelled) {
      setImages(result.selected)
    }
  }

  if (!allImages.length) {
    return null
  }

  return (
    <HStack alignItems="center" spacing {...stackProps}>
      {isEditing && <Button onPress={pickImage}>Upload image</Button>}
      {allImages.map(({ uri }) => {
        if (uri === '') {
          return <ImageFrame key={uri} />
        }
        return (
          <ImageFrame key={uri}>
            <Image source={{ uri }} style={{ width: imgWidth, height: imgHeight }} />
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
