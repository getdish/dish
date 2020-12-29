import { StackItemProps } from './HomeStackView'
import { HomeStateItem } from '../state/home-types'

export type HomeStackViewProps<
  A extends HomeStateItem = HomeStateItem
> = StackItemProps<A>
