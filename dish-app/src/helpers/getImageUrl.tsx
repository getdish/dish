import { IMAGE_PROXY_DOMAIN } from '../constants/constants'

export const getImageUrl = (
  url: string,
  width: number,
  height: number,
  quality = 100
) => {
  const imageUrl = `${IMAGE_PROXY_DOMAIN}/smartcrop?width=${width}&height=${height}&quality=${quality}&url=${url}`
  return imageUrl
}
