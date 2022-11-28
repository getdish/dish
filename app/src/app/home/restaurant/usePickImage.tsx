import { useIsMountedRef } from '../../../helpers/useIsMountedRef'
import { createImageFormData } from './createImageFormData'
import { uploadFile, useRefetch } from '@dish/graph'
import { supportsTouchWeb } from '@dish/helpers'
import { Text, Toast, XStack, YStack } from '@dish/ui'
import { Loader } from '@tamagui/lucide-icons'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'

export const usePickImage = ({
  query,
  restaurantSlug,
  reviewId,
}: {
  query?: any
  restaurantSlug?: string
  reviewId?: string
}) => {
  const refetch = useRefetch()
  const isMounted = useIsMountedRef()
  const [photos, setPhotos] = useState<string[]>([])

  const pick = async () => {
    console.log('pick image')
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    })
    if (!('selected' in result)) {
      Toast.show(`No images selected`)
      return
    }
    if (!result.cancelled) {
      setPhotos(result.selected.map((x) => x.uri))
    }
    for (const [index, { uri, height, width }] of result.selected.entries()) {
      const formData = createImageFormData(`image-${index}`, uri)
      Toast.show(
        <XStack>
          <YStack className={supportsTouchWeb ? '' : 'rotating'} opacity={1}>
            <Loader color="#fff" size={16} />
          </YStack>
          <Text>Uploading...</Text>
        </XStack>,
        { duration: 60000 * 3 }
      )
      const res = await uploadFile('reviewImages', formData, {
        headers: {
          // sending undefined sends an undefined string
          ...(restaurantSlug && {
            restaurantslug: restaurantSlug,
          }),
          ...(!!reviewId && {
            //  they get sent lowercased so match that
            reviewid: reviewId,
          }),
        },
      })
      if (!res) {
        Toast.error(`Couldn't upload :(`)
        setPhotos([])
        return
      }
      if (!isMounted.current) return
    }
    Toast.show(`All images uploaded`)
    refetch(query)
  }

  return { photos, pick }
}
