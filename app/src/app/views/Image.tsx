import { ImageProps, Image as RNImage } from 'react-native'

export function Image(props: ImageProps) {
  const uri = props.source?.['uri']
  if (uri && typeof uri !== 'string') {
    console.warn('invalid image uri', props)
    return null
  }

  return <RNImage {...props} />
}
