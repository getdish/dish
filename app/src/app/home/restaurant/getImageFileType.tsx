export const getImageFileType = (imageUrl: string) => {
  if (imageUrl.startsWith('data:')) {
    return imageUrl.match(/image\/([a-z]+)/i)?.[1]
  }
  const uriParts = imageUrl.split('.')
  return uriParts[uriParts.length - 1]
}
