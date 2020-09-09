import { HomeStateItem } from '../../state/home-types'
import { StackItemProps } from './HomeStackView'

export type HomePagePaneProps<
  A extends HomeStateItem = HomeStateItem
> = StackItemProps<A>
