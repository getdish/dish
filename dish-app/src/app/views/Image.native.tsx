import FastImage, { FastImageProps } from 'react-native-fast-image'

import { useAppShouldShow } from '../AppStore'

export const Image = (props: FastImageProps) => {
  const show = useAppShouldShow('images')
  return show ? <FastImage {...props} /> : null
}
