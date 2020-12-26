// debug
import { Paragraph, VStack, useMedia } from 'snackui'

// const size = getSize(props.size ?? 'md') * 1.5

export const Title = (props) => {
  return (
    <Paragraph
      fontWeight="300"
      {...props}
      marginVertical={0}
      size={props.size}
      sizeLineHeight={0.7}
    />
  )
}

// const extracts = {
//   backgroundColor: 'blue',
// }

// const cantExtract = eval(`{}`)

// export function A(props: any) {
//   const media = useMedia()
//   return (
//     <VStack
//       backgroundColor="red"
//       {...cantExtract}
//       borderWidth={1}
//       {...extracts}
//       {...(media.sm && {
//         backgroundColor: 'blue',
//       })}
//       {...(props.something && {
//         backgroundColor: 'green',
//       })}
//       {...(props.otherThing
//         ? { backgroundColor: 'yellow' }
//         : { backgroundColor: 'red' })}
//       {...props}
//     />
//   )
// }
