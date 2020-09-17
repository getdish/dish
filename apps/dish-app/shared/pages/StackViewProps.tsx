import { StackItemProps } from '../AppStackView'
import { HomeStateItem } from '../state/home-types'

export type StackViewProps<
  A extends HomeStateItem = HomeStateItem
> = StackItemProps<A>
