import React from 'react'
import { Button, Theme, Tooltip, useTheme } from 'snackui'

import { isWeb } from '../../constants/constants'
import { Link } from './Link'
import { LinkButtonProps } from './LinkProps'

export type SmallButtonProps = LinkButtonProps & {
  tooltip?: string
}

export const SmallButton = ({
  children,
  tooltip,
  name,
  tag,
  tags,
  params,
  href,
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
      {...(!rest.theme && {
        backgroundColor: 'transparent',
      })}
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
