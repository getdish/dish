import { HomeStateItem } from '../state/home-types'
import { StackItemProps } from './HomeStackView'

export type HomeStackViewProps<
  A extends HomeStateItem = HomeStateItem
> = StackItemProps<A>
