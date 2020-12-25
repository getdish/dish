import { StackProps } from 'snackui'

export function getGroupedButtonProps({
  index,
  items,
  borderRadius = 1000,
}: {
  index: number
  items: any[]
  borderRadius?: number
}) {
  const hasPrev = !!items[index - 1]
  const hasNext = !!items[index + 1]
  const extraProps: StackProps = {}
  extraProps.borderTopLeftRadius = hasPrev ? 0 : borderRadius
  extraProps.borderBottomLeftRadius = hasPrev ? 0 : borderRadius
  extraProps.borderTopRightRadius = hasNext ? 0 : borderRadius
  extraProps.borderBottomRightRadius = hasNext ? 0 : borderRadius
  if (hasPrev) {
    extraProps.marginLeft = -1
  }
  if (hasNext) {
    extraProps.marginRight = 0
  }
  return extraProps
}
