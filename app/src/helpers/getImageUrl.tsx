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
  const imageUrl = `${IMAGE_PROXY_DOMAIN}/pr:sharp/q:${Math.round(quality)}/rs:fill:${Math.round(
    width
  )}:${Math.round(height)}:0/g:sm/plain/${url}`
  return imageUrl
}
