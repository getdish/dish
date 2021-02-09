import React from 'react'
import { Button, Tooltip, themeable, useTheme } from 'snackui'

import { isWeb } from '../../constants/constants'
import { Link } from './Link'
import { LinkButtonProps } from './LinkProps'

export type SmallButtonProps = LinkButtonProps & {
  tooltip?: string
}

export const SmallButton = themeable(
  ({
    children,
    tooltip,
    name,
    tag,
    tags,
    params,
    href,
    theme: themeProp,
    ...rest
  }: SmallButtonProps) => {
    const theme = useTheme()

    let contents = (
      <Button
        borderRadius={20}
        borderWidth={1}
        borderColor={theme.borderColor}
        {...(isWeb && {
          minHeight: 36,
          minWidth: 44,
        })}
        {...(!isWeb && {
          minHeight: 42,
          minWidth: 48,
        })}
        backgroundColor={theme.backgroundColor}
        hoverStyle={{
          backgroundColor: theme.backgroundColorSecondary,
        }}
        {...rest}
      >
        {children}
      </Button>
    )

    if (name || tag || tags || params || href) {
      contents = (
        <Link name={name} tag={tag} tags={tags} params={params} href={href}>
          {contents}
        </Link>
      )
    }

    if (tooltip) {
      return <Tooltip contents={tooltip}>{contents}</Tooltip>
    }

    return contents
  }
)
