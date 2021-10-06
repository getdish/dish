import { Auth, UserFetchOpts } from './Auth'

export type UploadType = 'avatar' | 'reviewImages'

const endpoints = {
  avatar: '/user/uploadAvatar',
  reviewImages: '/user/uploadReviewImage',
} as const

export async function uploadFile(type: UploadType, body: FormData, opts?: UserFetchOpts) {
  const response = await Auth.api('POST', endpoints[type], body, {
    ...opts,
    rawData: true,
  })
  if (response.status !== 200) {
    console.error(`Error updating: ${response.status} ${response.statusText}`)
    return null
  }
  return await response.json()
}
