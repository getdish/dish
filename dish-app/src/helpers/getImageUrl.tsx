import { IMAGE_PROXY_DOMAIN } from '../constants/constants'

export const getImageUrl = (
  url: string | undefined,
  width: number,
  height: number,
  quality = 100
) => {
  if (!url) {
    return ''
  }
  const imageUrl = `${IMAGE_PROXY_DOMAIN}/smartcrop?width=${width}&height=${height}&quality=${quality}&url=${url}`
  return imageUrl
}
