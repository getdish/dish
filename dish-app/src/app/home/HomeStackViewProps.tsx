import { HomeStateItem } from '../../types/homeTypes'
import { StackItemProps } from './HomeStackView'

export type HomeStackViewProps<
  A extends HomeStateItem = HomeStateItem
> = StackItemProps<A>
