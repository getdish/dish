import { RoutesTable } from '@dish/router'
import React, { useEffect, useState } from 'react'
import { useThemeName } from 'snackui'
import { Button } from 'snackui'

import { colorNames } from '../../constants/colors'
import { DRouteName, router } from '../../router'
import { useLink } from '../hooks/useLink'
import { LinkButtonProps } from './LinkProps'

// most the logic here comes from useLink

export function LinkButton<Name extends DRouteName = DRouteName>(
  props: LinkButtonProps<Name, RoutesTable[Name]['params']>
) {
  const [isActive, setIsActive] = useState(false)
  const { wrapWithLinkElement } = useLink(props)

  const {
    children,
    replace,
    disallowDisableWhenActive,
    tags,
    tag,
    name,
    params,
    onPress,
    enableActiveStyle,
    activeTextStyle,
    textProps,
    opacity,
    disabled,
    theme,
    ...restProps
  } = props
  const themeName = useThemeName()

  useEffect(() => {
    if (!props.enableActiveStyle) {
      return
    }
    if (props.name) {
      let last = false
      const check = (val: string) => {
        const match = val === props.name
        if (match == last) return
        setIsActive(match)
        last = match
      }
      check(router.curPage.name)
      return router.onRouteChange(() => {
        check(router.curPage.name)
      })
    }
  }, [props.name])

  return wrapWithLinkElement(
    <Button
      // minHeight={10} // temp react-native
      disabled={disabled}
      {...restProps}
      {...(isActive && props.activeStyle)}
      textProps={isActive ? props.activeTextStyle : textProps}
      opacity={opacity}
      {...(disabled &&
        typeof opacity !== 'number' && {
          opacity: 0.5,
        })}
      {...(theme &&
        themeName === 'dark' && {
          textProps: {
            color: '#fff',
          },
        })}
      {...(theme && {
        theme:
          // @ts-expect-error
          colorNames.includes(theme) && themeName === 'dark' ? `${theme}-dark` : theme,
      })}
    >
      {getChildren(props, isActive)}
    </Button>
  )
}

const getChildren = (props: LinkButtonProps, isActive: boolean) => {
  if (typeof props.children === 'function') {
    return props.children(isActive)
  }
  return props.children
}
