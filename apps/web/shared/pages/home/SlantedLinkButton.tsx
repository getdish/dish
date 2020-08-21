import { LinkButton } from '../../views/ui/LinkButton'
import { LinkButtonProps } from '../../views/ui/LinkProps'
import { slantedBoxStyle } from './SlantedBox'

export const SlantedLinkButton = (props: LinkButtonProps) => {
  return <LinkButton {...slantedBoxStyle} {...props} />
}
