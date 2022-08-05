import { Square, SquareProps } from '@dish/ui'

export const SquareDebug = (props: SquareProps) => (
  // eslint-disable-next-line react/react-in-jsx-scope
  <Square zi={1000} size={200} bc="red" onPress={() => console.log(12)} {...props} />
)

globalThis['SquareDebug'] = SquareDebug
