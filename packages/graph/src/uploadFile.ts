import { Auth } from './Auth'

export type UploadType = 'avatar' | 'reviewImages'

const endpoints = {
  avatar: '/user/uploadAvatar',
  reviewImages: '/user/uploadReviewImages',
} as const

export async function uploadFile(type: UploadType, body: FormData) {
  const response = await Auth.api('POST', endpoints[type], body, {
    rawData: true,
  })
  if (response.status !== 200) {
    console.error(`Error updating: ${response.status} ${response.statusText}`)
    return null
  }
  return await response.json()
}
