// debug
import { VStack, useMedia } from 'snackui'

const extracts = {
  backgroundColor: 'blue',
}

const cantExtract = eval(`{}`)

export function A(props: any) {
  const media = useMedia()
  return (
    <VStack
      backgroundColor="red"
      {...cantExtract}
      borderWidth={1}
      {...extracts}
      {...(media.sm && {
        backgroundColor: 'blue',
      })}
      {...(props.something && {
        backgroundColor: 'green',
      })}
      {...(props.otherThing
        ? { backgroundColor: 'yellow' }
        : { backgroundColor: 'red' })}
      {...props}
    />
  )
}
