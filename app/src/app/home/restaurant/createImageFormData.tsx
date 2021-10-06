import { getImageFileType } from './getImageFileType'

export const createImageFormData = (name: string, uri: string) => {
  const formData = new FormData()
  const fileType = getImageFileType(uri)
  if (uri.startsWith('data:')) {
    const file = DataURIToBlob(uri)
    formData.append('review-image', file, `${name}.${fileType}`)
  } else {
    // @ts-ignore
    formData.append('photo', {
      // @ts-ignore
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
