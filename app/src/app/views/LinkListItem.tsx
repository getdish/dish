import { DRouteName } from '../../router'
import { useLink } from '../hooks/useLink'
import { LinkButtonProps } from './LinkProps'
import { RoutesTable } from '@dish/router'
import { ListItem, TooltipSimple } from '@dish/ui'
import React, { forwardRef } from 'react'

export const LinkListItem = forwardRef(function LinkListItemContent<
  Name extends DRouteName = DRouteName
>({ asChild, ...props }: LinkButtonProps<Name, RoutesTable[Name]['params']>, ref) {
  // @ts-ignore
  const { wrapWithLinkElement } = useLink(props, undefined, asChild)
  const {
    children,
    replace,
    tooltip,
    disallowDisableWhenActive,
    tags,
    preventNavigate,
    tag,
    name,
    params,
    onPress,
    isActive,
    stopPropagation,
    activeTextStyle,
    textProps,
    opacity,
    theme,
    promptLogin,
    ...restProps
  } = props
  const element = wrapWithLinkElement(
    <ListItem
      size="$5"
      hoverTheme
      {...restProps}
      ref={ref}
      theme={isActive ? 'active' : null}
      textProps={isActive ? props.activeTextStyle : textProps}
    >
      {getChildren(props, isActive)}
    </ListItem>
  )
  if (!!tooltip) {
    return <TooltipSimple label={tooltip}>{element}</TooltipSimple>
  }
  return element
})

const getChildren = (props: LinkButtonProps, isActive?: boolean) => {
  if (typeof props.children === 'function') {
    return props.children(isActive)
  }
  return props.children
}
