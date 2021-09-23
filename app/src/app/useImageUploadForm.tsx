import { UploadType, uploadFile } from '@dish/graph'
import { useRef } from 'react'
import { Toast } from 'snackui'

export const useImageUploadForm = (type: UploadType) => {
  const ref = useRef<HTMLFormElement>(null)

  return {
    async upload() {
      const form = ref.current
      if (!form) {
        console.error('no form ref')
        return
      }
      const formData = new FormData(form!)
      Toast.show('Uploading...')
      return await uploadFile(type, formData)
    },
    ref,
  }
}
